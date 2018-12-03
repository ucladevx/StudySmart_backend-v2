var casper = require('casper').create();
var links; classes;

function getLinks() {
// Scrape the links from top-right nav of the website
    var links = this.evaluate(function(){
		var results = []; 
		var elts = document.getElementById("ui-id-1").getElementsByTagName("li");
		for(var i = 0; i < elts.length; i++){
			var link = elts[i].getElementsByTagName("a")[0].getAttribute("href");
			var headline = elts[i].firstChild.textContent;
			results.push({link: link, headline: headline});
		}
		return results; 
	});
}

function getClasses() {
// Scrape the links from top-right nav of the website
    var links = this.evaluate(function(){
        var results = []; 
        var elts = document.getElementById("resultsTitle").getElementsByClassName("primarySection");
        for(var i = 0; i < elts.length; i++){
            var link = elts[i].getElementsByTagName("a")[0].getAttribute("href");
            var headline = elts[i].firstChild.textContent;
            results.push({link: link, headline: headline});
        }
        return results; 
    });
}



// Opens casperjs homepage
casper.start('https://sa.ucla.edu/ro/public/soc');

casper.then(function () {
    this.click('#select_filter_subject');
});

casper.then(function () {
	links = this.evaluate(getLinks);
});

casper.thenOpen('https://sa.ucla.edu/ro/public/soc' + "INSERT QUERY STRING HERE", function() {
    this.echo('Second Page: ' + this.getTitle());
});


casper.then(function () {
    classes = this.evaluate(getClasses);
});


casper.run(function () {
    for(var i in links) {
        console.log(links[i]);
    }
    casper.done();
});