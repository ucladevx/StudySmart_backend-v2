var express = require("express")
var mongoose = require("mongoose")
var app = express()

var conString = "mongodb://admin:admin@ds038319.mlab.com:38319/mylearning"

/**
 * Models 
 */
var User = mongoose.model("User", {
    firstName: String,
    lastName: String
})

var dummyUser = {
    firstName: "Sibeesh",
    lastName: "Venu"
}

mongoose.connect(conString, { useMongoClient: true }, () => {
    console.log("DB is connected")
    saveData()
})

app.listen("3010", () => {
    console.log("I just started listening")
})

function saveData() {
    var user = new User(dummyUser);
    user.save();
}