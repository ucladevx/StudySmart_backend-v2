"use strict";

const request = require("request");
const moment = require("moment");

const currentTerm = "19S";
const mainURL =
  "https://www.registrar.ucla.edu/desktopmodules/ClassRoomSearch/api/webapi/GetClassroomItems";
const classroomURL =
  "https://www.registrar.ucla.edu/desktopmodules/ClassRoomSearch/api/webapi/GetCalendarEvents";

function processClassroomJson(buildingClassroom) {
  let toReturn = {
    building: buildingClassroom.value.slice(0, 8),
    room: buildingClassroom.value.substr(9),
    buildingName: buildingClassroom.label.slice(0, 8).trim(),
    roomName: buildingClassroom.label.substr(9).trim()
  };
  return toReturn;
}

function processClassTimeObject(buildingArray, classNameTime) {
  if (classNameTime.enroll_total === 0) return buildingArray;

  let processedObject = {
    day: "",
    start: "",
    end: ""
  };

  if (classNameTime.start.substr(0, 9) != "2014-11-1") {
    processedObject.day = "Varies";
    processedObject.start = classNameTime.start.substr(0, 5);
    processedObject.end = classNameTime.end.substr(0, 5);
  } else {
    let startTime = moment(classNameTime.start);
    let endTime = moment(classNameTime.end);

    processedObject.day = startTime.format("d");
    processedObject.start = startTime.format("HH:mm");
    processedObject.end = endTime.format("HH:mm");
  }
  buildingArray.push(processedObject);
  return buildingArray;
}

function getClassroomTimes(buildingRoomObject) {
  let options = {
    method: "GET",
    url: classroomURL,
    qs: {
      term: currentTerm,
      building: buildingRoomObject.building,
      room: buildingRoomObject.room
    },
    json: true,
    callback: function(error, response, body) {
      if (error) throw new Error(error);

      body = body.reduce(processClassTimeObject, []);

      let finalClassroomObject = {
        building: buildingRoomObject.buildingName,
        room: buildingRoomObject.roomName,
        classTimes: body
      };
      console.log(finalClassroomObject);
    }
  };
  request(options);
}

let options = {
  method: "GET",
  url: mainURL,
  json: true,
  callback: function(error, response, body) {
    console.log("got classrooms");
    let classrooms = body.map(processClassroomJson);
    classrooms.forEach(getClassroomTimes);
  }
};

request(options);
