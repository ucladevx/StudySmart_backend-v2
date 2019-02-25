# Web scrapers


## how to run
* scheduler.js is entry point
* call your scrapers in scheduler.js as such
  ```node.js
  setInterval(function () {
    console.log("I am doing my 5 minutes check");
    [YOUR_SCRAPER.]scrape();
    // do your stuff here
  }, [INTERVAL IN MS]);
  ```
