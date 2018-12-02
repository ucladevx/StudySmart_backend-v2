var express = require('express');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');


var app = express();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

/*Temporary DB structure (feel free to add to prototypes)

User Table:

{
	_id: (primary key on db)
	socialId: (possibly for google/fb integration)
	classes: [{
		_id: (primary key of class in the class table)
		name: (name of class)
		notifications: (on/off)
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
		byUser: (_id of user)
	]}
}





Location Table:

{
	_id: 
	type: (library/study room/special)
	mapCoords: (not sure how to implement)
	activityLevel: (not sure how to measure)

}

*/


var url = "mongodb://aseem:Secure123@ds123499.mlab.com:23499/studysmart";

var origin = "https://google.com";
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', origin || "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
    next();
});

app.get('/', function(req, res){
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		console.log("Database connected");


		db.close();
		res.end("Nothing requested");
	});
})


app.get('/user/:id', function(req, res) {

	var socialId = req.params.id;

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		console.log("Database connected");
		var o_id = new mongo.ObjectID(socialId);
		var query = {_id: o_id}
		var dbo = db.db("studysmart");
		dbo.collection("user").find(query).toArray(function(err, result) {
			if (err) throw err;
			var resjson = result[0];

			if(result.length == 0){
				db.close();
				res.write("No user found.");
			}

			db.close();
			res.json(resjson);
		});

		
	});

})

app.listen(process.env.PORT || 3000);