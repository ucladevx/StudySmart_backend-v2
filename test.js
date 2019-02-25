var scp = require("./scp");

min_to_ms = 60000;
var minutes = 0.25, the_interval = minutes * ms_to_mins;
// console.log("I am doing my 5 minutes check");

setInterval(function () {
  console.log("I am doing my 5 minutes check");
  scp.test();
  // do your stuff here
}, the_interval);

setInterval(function () {
  console.log("I am doing my 10 minutes check");
  // do your stuff here
}, the_interval * 2);
