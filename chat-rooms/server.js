var express = require("express")
var app = express()
var mongoose = require('mongoose')
var bodyParser = require("body-parser")

var http = require("http").Server(app)
var io = require("socket.io")(http)



var conString = "mongodb://brendon:sandbox1@ds211724.mlab.com:11724/studysmart-sandbox"
app.use(express.static(__dirname))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.Promise = Promise

var Chats = mongoose.model("Chats", {
	name: String,
	chat: String
})

mongoose.connect(conString, { useMongoClient: true}, (err) => {
	console.log("DB is connected", err)
})

app.post("/chats", async (req, res) => {
	try{
		var chat = new Chats(req.body)
		await chat.save()
		res.sendStatus(200)
	} catch (error) {
		res.sendStatus(500)
		console.error(error)
	}
})


app.get("/chats", (req, res) => {
    Chats.find({}, (error, chats) => {
        res.send(chats)
    })
})

io.on("connection", (socket) => {
	console.log("Socket is connected...")
})

var server = http.listen(3020, () => {
	console.log("Now listening on ", server.address().port)
})





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










