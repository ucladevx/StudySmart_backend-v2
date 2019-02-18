const puppeteer = require('puppeteer');
const request = require('request');

/*
//exam

{
	"name":"Arts Library",
	"location":" 1400 Public Affairs Building, Los Angeles, CA 90095-1392",
	"start_date":"Feb 17 ",
	"department":
	[
		{
			"department_name":"Arts Library",
			"time":
			[
				{"dp_open_time":"1pm - 5pm","date":"Su 17"},
				{"dp_open_time":"9am - 5pm","date":"M 18"},
				{"dp_open_time":"8am - 9pm","date":"Tu 19"},
				{"dp_open_time":"8am - 9pm","date":"W 20"},
				{"dp_open_time":"8am - 9pm","date":"Th 21"},
				{"dp_open_time":"8am - 5pm","date":"F 22"},
				{"dp_open_time":"1pm - 5pm","date":"Sa 23"}
			]
		},
		{
			"department_name":"CLICC Laptop & iPad Lending (Arts Library)",
			"time":
			[
				{"dp_open_time":"1pm - 4:30pm","date":"Su 17"},
				{"dp_open_time":"9am - 4:30pm","date":"M 18"},
				{"dp_open_time":"8am - 8:30pm","date":"Tu 19"},
				{"dp_open_time":"8am - 8:30pm","date":"W 20"},
				{"dp_open_time":"8am - 8:30pm","date":"Th 21"},
				{"dp_open_time":"8am - 4:30pm","date":"F 22"},
				{"dp_open_time":"1pm - 4:30pm","date":"Sa 23"}
			]
		},
		{
			"department_name":"Reference Desk",
			"time":
			[
				{"dp_open_time":"Closed","date":"Su 17"},
				{"dp_open_time":"Closed","date":"M 18"},
				{"dp_open_time":"11am - 4pm","date":"Tu 19"},
				{"dp_open_time":"11am - 4pm","date":"W 20"},
				{"dp_open_time":"11am - 4pm","date":"Th 21"},
				{"dp_open_time":"11am - 4pm","date":"F 22"},
				{"dp_open_time":"Closed","date":"Sa 23"}
			]
		}
	]
}
*/
(async function main() {
  
    try {
        
        const browser = await puppeteer.launch({headless:false});
        const [page] = await browser.pages();
        //Url to visit
        await page.goto('https://www.library.ucla.edu/hours');

        const result = await page.evaluate(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            //find names of the 11 libraries
            const names=document.querySelectorAll('div.pane-node-title h2')
            //find address of the 11 libraries
            const addresses=document.querySelectorAll('div.location__address')
            //find opening times of the 11 libraries
            const time_of_dp=document.querySelectorAll('table.opening-hours-week')
            const num_rooms = names.length;
            const data = [];
            for (let n = 0; n < num_rooms; n++)
            {
                var obj = new Object();
                //add name to lib obj
                const lib_name=names[n].innerText
                obj["name"]=lib_name
               
                //add location to lib obj
                const lib_loc=addresses[n].innerText
                obj["location"]=lib_loc
                
                //add department to lib obj
                const department=[]
                lib_dp = time_of_dp[n].innerText
                list_dp=lib_dp.split("\n")
                //first line : date 
                //after : openning time for each department
                const date = list_dp[0].split('\t')
                obj["start_date"]=date[0].split("-")[0]
                const num_dp=list_dp.length-1
                for(let i = 0;i<num_dp;i++)
                {
                    var dp_obj = new Object();
                    dp_info=list_dp[i+1].split('\t')
                    dp_obj["department_name"]=dp_info[0]

                    //console.log(list_dp[i+1].split('\t'));
                    //dp_open=dp_info[1].split("  ")
                    //dp_obj["dp_info"]=dp_info[2]
                    dp_open_time=[]
                    const open_day=dp_info.length-1
                    for(let j=0;j<open_day;j++)
                    {
                        var dp_time_obj = new Object();
                        dp_time_obj["dp_open_time"]=dp_info[j+1]
                        dp_time_obj["date"]=date[j+1]
                        dp_open_time.push(dp_time_obj); 
                    }
                    dp_obj["time"]=dp_open_time
                    department.push(dp_obj); 
                }
                obj["department"]=department
                data.push(JSON.stringify(obj));  
            }
            return data
        
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
