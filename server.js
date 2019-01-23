var express = require('express');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var {OAuth2Client} = require('google-auth-library');
var io = require('socket.io-client');

var app = express();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

/*Temporary DB structure (feel free to add to prototypes)

User Table:

{
	_id: (primary key on db, same as google id)
	socialId: (used for google/fb integration)
	classes: [{
		_id: (primary key of class in the class table)
		name: (name of class)
		notifications: (on/off)
	}]
	testPoints: (number of points for test bank)
}


//Chat could be implemented used Socket.io, which emits events to those who are connected, and stores messages in a database intermittently

Class Table:

{
	_id: (primary key in db)
	name: (name of class, MongoDB index exists for this field)
	schedule: [{
		day: 
		startTime:
		endTime:
	}]
	locations: []
	users: [{
		_id: (primary key of each user in the class)
	}]
	chatMessages: (id of class chat)
}


Class chat:

{
	_id: 
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


var url = "mongodb://studysmart:Ucladevx@docdb-2019-01-22-02-17-38.cluster-cayykuvdkvwh.us-east-1.docdb.amazonaws.com:27017/?ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0";
var CLIENT_ID = "THE APP'S CLIENT ID HERE";
const client = new OAuth2Client(CLIENT_ID);

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



//USER SECTION

//Get all user info
app.get('/user/:id', function(req, res) {

	var userId = req.params.id;

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		console.log("Database connected");
		var query = {_id: userId}
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


//Use this for sign in
app.post('/user/:id', function(req, res) {
	var userId = req.params.id;
	var socialId = req.body.socialId;

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		console.log("Database connected");
		const ticket = await client.verifyIdToken({
			idToken: socialId,
			audience: CLIENT_ID,
		}).catch(err => { 
			console.log(err); 
			var resjson = {
				error: true,
				newUser: true,
				id: null
			}

			db.close();
			res.json(resjson);
		});
		//const payload = ticket.getPayload();
		//const userid = payload['sub'];

		//var o_id = new mongo.ObjectID(socialId);
		var query = {_id: userId}
		var dbo = db.db("studysmart");
		dbo.collection("user").find(query).toArray(function(err, result) {
			if (err) throw err;
			var resjson = result[0];

			if(result.length == 0){
				var newUser = {
					_id: userId,
					socialId: socialId,
					classes: [],
					testPoints: 0
				}

				dbo.collection("user").insertOneAndUpdate(newUser, function(err, result) {
					if (err) throw err;
					var resjson = {
						error: false,
						newUser: true,
						id: result.value._id
					}

					db.close();
					res.json(resjson);
				});
			}
			else{
				var toupdate = {$set: {socialId: socialId}};
				dbo.collection("user").findOneAndUpdate(query, toupdate, function(err, result) {
					if (err) throw err;
					var resjson = {
						error: false,
						newUser: false,
						id: result.value._id
					}

					db.close();
					res.json(resjson);
				});
			}

		});
	});
})



//CLASSES SECTION

//Get all class info, search by name or id
app.get('/class', function(req, res) {

})


//Get class chat (or the last few messages). Start socket connection, and allow user to post chats
app.get('/classchat/:id', function(req, res) {
	
})


//Create a new class (and class chat), check if name conflict
app.post('/class', function(req, res) {
	
})


//LOCATIONS SECTION

//Get locations, possibly all or some locations
app.get('/locations', function(req, res) {

})


//Get location info
app.get('/location/:id', function(req, res) {

})


//Post location info
app.post('/location', function(req, res) {

})


app.listen(process.env.PORT || 3000);