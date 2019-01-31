const puppeteer = require('puppeteer');

(async function main() {
  try {
    const browser = await puppeteer.launch(/*{headless:false}*/);
    const [page] = await browser.pages();
    await page.goto('http://calendar.library.ucla.edu/spaces?lid=4394&gid=0');
    const result = await page.evaluate(async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const num_rooms = document.querySelectorAll('.s-lc-eq-avail').length;
        const rooms = document.querySelectorAll('.s-lc-eq-avail');
        const data = [];
        for (let n = 0; n < num_rooms; n++) {
            const title = rooms[n].getAttribute('title');
            if (title.indexOf('A') > -1 || title.indexOf('B') > -1 || title.indexOf('C') > -1 || 
                title.indexOf('D') > -1 || title.indexOf('E') > -1 || title.indexOf('F') > -1) {
                data.push(new Array(title, "Capacity: 8"));
            } 
            else if (title.indexOf('G01') > -1 || title.indexOf('G02') > -1 || title.indexOf('G03') > -1 || 
                    title.indexOf('G04') > -1 || title.indexOf('G05') > -1 || title.indexOf('G06') > -1 ||
                    title.indexOf('G07') > -1 || title.indexOf('G08') > -1 || title.indexOf('G09') > -1 || 
                    title.indexOf('G10') > -1 || title.indexOf('G11') > -1 || title.indexOf('G12') > -1 || 
                    title.indexOf('G13') > -1 || title.indexOf('G14') > -1 || title.indexOf('G15') > -1) {
                data.push(new Array(title, "Capacity: 8"));
            } else {
                data.push(new Array(title, "Capacity: 6"));
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