var lib_info_scraper = require("./lib_info_scraper");

var min_to_ms = 60000;
var lib_info_scraper_interval = 5 * min_to_ms;
// console.log("I am doing my 5 minutes check");

setInterval(function () {
  console.log("I am doing my 5 minutes check");
  lib_info_scraper.scrape();
  // do your stuff here
}, lib_info_scraper_interval);

// setInterval(function () {
//   console.log("I am doing my 10 minutes check");
//   // do your stuff here
// }, the_interval * 2);
