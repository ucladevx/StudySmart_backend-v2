var express = require('express');

var app = express();


/*Temporary DB structure (feel free to add to prototypes)

User Table:

{
	_id: (primary key on db)
	socialId: (possibly for google/fb integration)
	classes: [{
		_id: (primary key of class in the class table)
		name: (name of class)
	}]
	testPoints: (number of points for test bank)
}


SocialId Table:

{
	socialId: (primary key for table, ids for google/fb authorization)
	userId: (user id, found as _id in the user table)
}


//Chat could be implemented used Socket.io, which emits events to those who are connected, and stores messages in a database intermittently

Class Table:

{
	_id: (primary key in db)
	name: (name of class)
	schedule: [{
		day: 
		startTime:
		endTime:
	}]
	users: [{
		_id: (primary key of each user in the class)
	}]
	chatMessages: {[
		time: (time when message was sent)
		text: (actual content)
	]}
}


Location Table:

{
	_id: 
}

*/

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