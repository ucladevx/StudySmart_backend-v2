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
    for (var dayIndex = 0; dayIndex < next21DaysStrings.length; dayIndex++)
      sendRequest(meetingRoomIndex, durationIndex, dayIndex);
  }
}

function sendRequest(meetingRoomIndex, durationIndex, dayIndex) {
  let options = {
    method: "GET",
    url: "http://reslife.ucla.edu/reserve",
    qs: {
      type: meetingRooms[meetingRoomIndex],
      duration: durations[durationIndex],
      date: next21DaysStrings[dayIndex],
      partial: ""
    },
    headers: {},
    callback: function(error, response, body) {
      if (error) sendRequest(meetingRoomIndex, durationIndex, dayIndex);
      else {
        const dom = new JSDOM(body);

        let data = [];
        let columns = dom.window.document.querySelectorAll(".col-md-6");
        //Get all links so that you can redirect user to registration page directly
        let links = dom.window.document.getElementsByTagName("a");
        let filteredLinks = [];
        //Need to filter all links so that we only save the ones with the class mentioned below
        for (k = 0; k < links.length; k++) {
          if (
            links[k].getAttribute("class") ==
            "btn btn-sm btn-block btn-default btn-select"
          ) {
            filteredLinks.push(links[k]);
          }
        }
        //Counter for filtered links
        var k = 0;
        //Start at 2 because first value is not relevant
        //Increment by 2 because every pair of 2 elements gives us "room details" and "time"

        for (var i = 2; i < columns.length; i += 2) {
          //Create JS object and push required elements
          var obj = new Object();
          obj["Room Details"] = columns[i].textContent.trim();
          obj["Time"] = columns[i + 1].textContent.trim();
          obj["Link"] = filteredLinks[k].getAttribute("href");
          k++;
          //Push
          data.push(obj);
        }
        console.log(data);
      }
    }
  };
  setTimeout(o => request(o), 0, options);
}
