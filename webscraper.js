'use strict';

const puppeteer = require('puppeteer');

/*
JSON Format {
  "Room Details": "Sproul Study Room 110E (max 4 people)",
  "Time": "11:00pm-midnight on Sun, Mar 03",
  "Link": "https://www.orl.ucla.edu/reserve?type=sproulstudy&duration=60&date=2019-03-03&roomid=3584&start=1551682800&stop=1551686400"
}
*/

(async function main() {
  
  try {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();

    await page.goto('https://reslife.ucla.edu/reserve');

    const result = await page.evaluate(async () => {
        const list_rooms = document.querySelectorAll('.reserve-grid .col-md-4 input').length;
        const data = [];
        for(let n = 0; n < list_rooms; n++) {
            const room = document.querySelectorAll('.reserve-grid .col-md-4 input').item(n);
            room.click();
            await new Promise((resolve) => setTimeout(resolve, 2000));
            document.querySelector('.reserve-grid .col-md-6 input').click();
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const length = document.querySelectorAll('.calendar-available').length; 
            for (let j = 0; j < 7 && j < length; j++) { 
                const element = document.querySelectorAll('.calendar-available').item(j);
                element.click();
                await new Promise((resolve) => setTimeout(resolve, 2000));
                let columns = document.querySelectorAll('.col-md-6');
                //Get all links so that you can redirect user to registration page directly
                let links = document.getElementsByTagName('a');
                let filteredLinks = [];
                //Need to filter all links so that we only save the ones with the class mentioned below
                for (k = 0; k < links.length; k++){
                  if (links[k].getAttribute("class") == "btn btn-sm btn-block btn-default btn-select"){
                    filteredLinks.push(links[k]);
                  }
                }
                //Counter for filtered links
                var k = 0;
                //Start at 2 because first value is not relevant
                //Increment by 2 because every pair of 2 elements gives us "room details" and "time"
                for(i = 2; i < columns.length; i+=2) {
                  //Create JS object and push required elements
                  var obj = new Object();
                  obj["Room Details"] = columns[i].innerText;
                  obj["Time"] = columns[i+1].innerText;
                  obj["Link"] = filteredLinks[k].getAttribute("href");
                  k++;
                  //Push
                  data.push(obj);
                }
            } 
        }
        return data;
    });

    console.log(result);
    await browser.close();
  } 
    catch (err) {
        console.error(err);
  }
})();