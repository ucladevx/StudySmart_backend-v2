var express = require("express")
var app = express()
var mongoose = require('mongoose')


app.listen("3010", ()=>{
	console.log("I just started listening!.")
})

var conString = "mongodb://brendon:sandbox1@ds211724.mlab.com:11724/studysmart-sandbox"

/**
*
* Models
*/

var User = mongoose.model("User", {
	firstName: String,
	lastName: String
})

var dummyUser = {
	firstName: "Dummy",
	lastName: "User"
}

function saveData(){
	var user = new User(dummyUser);
	user.save();
}

mongoose.connect(conString, { useMongoClient: true}, () => {
	console.log("DB is connected")
	saveData()
})






