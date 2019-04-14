"use strict";

const moment = require("moment-timezone");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const request = require("request");
/*
JSON Format {
  "Room Details": "Sproul Study Room 110E (max 4 people)",
  "Time": "11:00pm-midnight on Sun, Mar 03",
  "Link": "https://www.orl.ucla.edu/reserve?type=sproulstudy&duration=60&date=2019-03-03&roomid=3584&start=1551682800&stop=1551686400"
}
*/

const meetingRooms = [
  "deneve",
  "hedrick",
  "hedrickstudy",
  "hedrickmusic",
  "movement",
  "music",
  "rieber",
  "sproulmusic",
  "sproulstudy"
];

const durations = ["60", "120"];

var now = moment().tz("America/Los_Angeles");
const formatString = "YYYY-MM-DD";

let next21DaysStrings = [];

let numSaturdays = 0;
for (var i = 0; numSaturdays < 3; i++) {
  next21DaysStrings[i] = now.format(formatString);

  if (now.day() == 6) numSaturdays++;
  now.add(1, "days");
}

var errors = 0;

let timeout = 0;

for (
  var meetingRoomIndex = 0;
  meetingRoomIndex < meetingRooms.length;
  meetingRoomIndex++
) {
  for (
    var durationIndex = 0;
    durationIndex < durations.length;
    durationIndex++
  ) {
    for (var dayIndex = 0; dayIndex < next21DaysStrings.length; dayIndex++) {
      sendRequest(meetingRoomIndex, durationIndex, dayIndex, timeout);
      ++timeout;
    }
  }
}

function sendRequest(a, b, c, d) {
  let options = {
    method: "GET",
    url: "http://reslife.ucla.edu/reserve",
    qs: {
      type: meetingRooms[a],
      duration: durations[b],
      date: next21DaysStrings[c],
      partial: ""
    },
    headers: {},
    callback: function(error, response, body) {
      if (error) {
        ++errors;
        console.log(errors);
        sendRequest(a, b, c, 0);
      } else {
        console.log("worked correctly");
      }
    }
  };
  setTimeout(o => request(o), 0, options);
}
