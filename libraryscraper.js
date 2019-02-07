const puppeteer = require('puppeteer');
const request = require('request');

/* 
JSON Format
{
    "Building Name": "Powell Library"
    "Room Number": "Group Study Room F"
    "Capacity": 6
    "Date": "February 5, 2019"
    "Day": "Tuesday"
    "Start Time": "1:00PM"
}
*/

(async function main() {
  
    try {
        
        const browser = await puppeteer.launch(/*{headless:false}*/);
        const [page] = await browser.pages();
        //Url to visit
        await page.goto('http://calendar.library.ucla.edu/spaces?lid=4394&gid=0');

        const result = await page.evaluate(async () => {
            //Wait for webpage to load (may need to change this 2000 ms)
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const rooms = document.querySelectorAll('.s-lc-eq-avail');
            //Save length to prevent function call overhead in for loop
            const num_rooms = rooms.length;
            //Empty array to append JSON objects to
            const data = [];
            
            for (let n = 0; n < num_rooms; n++) {
                var obj = new Object();
                //Get title attribute from Anchor html elemet
                const title = rooms[n].getAttribute('title');
                //Split by commas
                var splitByCommas = title.split(",");
                //Split first element of splitByCommas array by spaces
                var timeAndDay = splitByCommas[0].split(" ");
                //Split third element of splitByCommas array by dashes
                var yearAndRoom = splitByCommas[2].split("-"); 
                
                //Specific study room numbers for Powell
                if     (yearAndRoom[1].indexOf('A') > -1 || yearAndRoom[1].indexOf('B') > -1 || yearAndRoom[1].indexOf('C') > -1 || 
                        yearAndRoom[1].indexOf('D') > -1 || yearAndRoom[1].indexOf('E') > -1 || yearAndRoom[1].indexOf('F') > -1) 
                    {
                        obj["Building Name"] = "Powell Library";
                        obj["Room"] = yearAndRoom[1].trim();
                        obj["Capacity"] = 8;
                        obj["Date"] = splitByCommas[1].trim() + yearAndRoom[0].trimRight();
                        obj["Day"] = timeAndDay[1].trim();
                        obj["Start Time"] = timeAndDay[0].trim();
                    } 
                
                //Specific room numbers for YRL study rooms
                else if(yearAndRoom[1].indexOf('G01') > -1 || yearAndRoom[1].indexOf('G02') > -1 || yearAndRoom[1].indexOf('G03') > -1 || 
                        yearAndRoom[1].indexOf('G04') > -1 || yearAndRoom[1].indexOf('G05') > -1 || yearAndRoom[1].indexOf('G06') > -1 ||
                        yearAndRoom[1].indexOf('G07') > -1 || yearAndRoom[1].indexOf('G08') > -1 || yearAndRoom[1].indexOf('G09') > -1 || 
                        yearAndRoom[1].indexOf('G10') > -1 || yearAndRoom[1].indexOf('G11') > -1 || yearAndRoom[1].indexOf('G12') > -1 || 
                        yearAndRoom[1].indexOf('G13') > -1 || yearAndRoom[1].indexOf('G14') > -1 || yearAndRoom[1].indexOf('G15') > -1) 
                    {
                        obj["Building Name"] = "Young Research Library";
                        obj["Room"] = yearAndRoom[1].trim();
                        obj["Capacity"] = 8;
                        obj["Date"] = splitByCommas[1].trim() + yearAndRoom[0].trimRight();
                        obj["Day"] = timeAndDay[1].trim();
                        obj["Start Time"] = timeAndDay[0].trim();
                    } 
                
                //Everything else must be a study pod in YRL
                else {
                        obj["Building Name"] = "Young Research Library";
                        obj["Room"] = yearAndRoom[1].trim();
                        obj["Capacity"] = 6;
                        obj["Date"] = splitByCommas[1].trim() + yearAndRoom[0].trimRight();
                        obj["Day"] = timeAndDay[1].trim();
                        obj["Start Time"] = timeAndDay[0].trim();
                    }
        
                //Add to data array
                data.push(JSON.stringify(obj));  
            }

        return data;
        });

        console.log(result);
        await browser.close();
    } 
    
    //If there is an error, write to console and exit
    catch (err) {
        console.error(err);
        return;
    }

})();