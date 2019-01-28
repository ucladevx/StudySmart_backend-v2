'use strict';

const puppeteer = require('puppeteer');

(async function main() {
  try {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();

    await page.goto('https://reslife.ucla.edu/reserve');

    const result = await page.evaluate(async () => {
       // document.querySelector('.reserve-grid .col-md-4 input').click();
       // await new Promise((resolve) => setTimeout(resolve, 2000));
       // document.querySelector('.reserve-grid .col-md-6 input').click();
       // await new Promise((resolve) => setTimeout(resolve, 2000)); */

        const list_rooms =document.querySelectorAll('.reserve-grid .col-md-4 input').length;
        const data = [];
        for(let n = 0; n < list_rooms; n++) {
            const room = document.querySelectorAll('.reserve-grid .col-md-4 input').item(n);
            room.click();
            await new Promise((resolve) => setTimeout(resolve, 2000));
            document.querySelector('.reserve-grid .col-md-6 input').click();
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const length = document.querySelectorAll('.calendar-available').length; // <-
            for (let j = 0; j < 7 && j < length; j++) { // <-
                const element = document.querySelectorAll('.calendar-available').item(j); // <-
                data_sub = [];
                element.click();
                await new Promise((resolve) => setTimeout(resolve, 2000));
                let columns = document.querySelectorAll('.col-md-6');
                for(i = 2; i < columns.length; i++){
                    let info = columns[i].innerText;
                    data_sub.push(info);
                }
                data.push(data_sub);
            } 
        }
        return data;
    });

    console.log(result);

    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();