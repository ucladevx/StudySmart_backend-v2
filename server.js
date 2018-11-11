var express = require('express');

var app = express();

var origin = "https://google.com";
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', origin || "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
    next();
});

app.get('/', function(req, res){
	res.send("StudySmart");
})