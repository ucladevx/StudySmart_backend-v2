var express = require("express");
var bodyParser = require("body-parser");
var { OAuth2Client } = require("google-auth-library");
var io = require("socket.io-client");
var AWS = require("aws-sdk");
const { Client } = require("pg")

AWS.config.update({ region: "us-east-1" });
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

var app = express();

app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(bodyParser.json({ limit: "500mb" }));

/*Temporary DB structure (feel free to add to prototypes)

user Collection:

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

class Collection:

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


classChat Collection:

{
	_id:
	chatMessages: {[
		time: (time when message was sent)
		text: (actual content)
		byUser: (_id of user)
	]}
}


location Collection:

{
	name:
	type: (library/study room/special)
	mapCoords: (not sure how to implement)
	activityLevel: (not sure how to measure)
}

*/

var CLIENT_ID =
  "373351297766-5f4knsqmvuu540bl3oh24i6qu2uh4lif.apps.googleusercontent.com";
const oauthClient = new OAuth2Client(CLIENT_ID);

var origin = "https://google.com";
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", origin || "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,HEAD,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "content-Type,x-requested-with");
  next();
});

app.get("/", function (req, res) {
  var query = {
    TableName: "user",
    Key: {
      _id: "mytest"
    }
  };

  docClient.get(query, function (err, data) {
    if (err) {
      //throw err;
      res.send("err");
    }
    res.send(data);
  });
});

//USER SECTION

//Get all user info
app.get("/user/:id", function (req, res) {
  //var userId = req.params.id;
  var socialId = req.params.socialId;

  MongoClient.connect(url, function (err, db) {
    if (err)
      //throw err;
      res.send(err);
    console.log("Database connected");

    const verifyToken = new Promise(function (resolve, reject) {
      client.verifyIdToken(socialId, CLIENT_ID, function (e, login) {
        if (login) {
          var payload = login.getPayload();
          var googleId = payload["sub"];
          resolve(googleId);
        } else {
          reject("invalid token");
        }
      });
    });

    verifyToken
      .then(function (userId) {
        var query = {
          TableName: "user",
          Key: {
            _id: userId
          }
        };

        docClient.get(params, function (err, data) {
          if (err)
            //throw err;
            res.send(err);
          d;
        });

        var dbo = db.db("studysmart");
        dbo
          .collection("user")
          .find(query)
          .toArray(function (err, result) {
            if (err)
              //throw err;
              res.send(err);
            var resjson = result[0];

            if (result.length == 0) {
              db.close();
              var errjson = {
                error: "No user found"
              };
              res.json(errjson);
            }

            db.close();
            res.error = null;
            res.json(resjson);
          });
      })
      .catch(function (err) {
        console.log(err);
        var resjson = {
          error: "Authentication error",
          newUser: false,
          id: null
        };

        db.close();
        res.json(resjson);
      });
  });
});

//Use this for sign in
app.post("/user/:id", function (req, res) {
  //var userId = req.params.id;
  var socialId = req.params.socialId;

  const verifyToken = new Promise(function (resolve, reject) {
    client.verifyIdToken(socialId, CLIENT_ID, function (e, login) {
      if (login) {
        var payload = login.getPayload();
        var googleId = payload["sub"];
        resolve(googleId);
      } else {
        reject("invalid token");
      }
    });
  });

  verifyToken
    .then(function (userId) {
      var query = { _id: userId };
      var dbo = db.db("studysmart");
      dbo
        .collection("user")
        .find(query)
        .toArray(function (err, result) {
          if (err)
            //throw err;
            res.send(err);
          var resjson = result[0];

          if (result.length == 0) {
            var newUser = {
              _id: userId,
              socialId: socialId,
              classes: [],
              testPoints: 0
            };

            dbo
              .collection("user")
              .insertOneAndUpdate(newUser, function (err, result) {
                if (err)
                  //throw err;
                  res.send(err);
                var resjson = {
                  error: null,
                  newUser: true,
                  id: socialId
                };

                db.close();
                res.json(resjson);
              });
          } else {
            var toupdate = { $set: { socialId: socialId } };
            dbo
              .collection("user")
              .findOneAndUpdate(query, toupdate, function (err, result) {
                if (err)
                  //throw err;
                  res.send(err);
                var resjson = {
                  error: null,
                  newUser: false,
                  id: socialId
                };

                db.close();
                res.json(resjson);
              });
          }
        });
    })
    .catch(function (err) {
      console.log(err);
      var resjson = {
        error: "Authentication error",
        newUser: false,
        id: null
      };

      db.close();
      res.json(resjson);
    });
});

//CLASSES SECTION

//Get all class info, search by name or id
app.get("/class", function (req, res) { });

//Get class chat (or the last few messages). Start socket connection, and allow user to post chats
app.get("/classchat/:id", function (req, res) { });

//Create a new class (and class chat), check if name conflict
app.post("/class", function (req, res) { });

//LOCATIONS SECTION

//Get locations, possibly all or some locations
app.get("/locations", function (req, res) { });

//Get location info
app.get("/location/:id", function (req, res) { });

//Post location info
app.post("/location", function (req, res) { });

//Get libinfo
app.get("/libinfo", function (req, res) {
  var query = {
    TableName: "lib_info"
  };

  dynamodb.scan(query, function (err, data) {
    if (err) {
      throw err;
      res.send("err");
    }
    res.send(JSON.stringify(data));
  });
});

app.get("/libinfo/:name", function (req, res) {
  var query = {
    TableName: "lib_info",
    Key: {
      name: req.params.name
    }
  };

  docClient.get(query, function (err, data) {
    if (err) {
      throw err;
      res.send("err");
    }
    res.send(data);
  });
});

//Get libinfo
app.get("/busyness_graphs", function (req, res) {
  var query = {
    TableName: "lib_busyness"

  };

  dynamodb.scan(query, function (err, data) {
    if (err) {
      // throw err;
      res.send("err");
    }
    res.send(data);
  });
});

//Get libinfo
app.get("/current_busyness", function (req, res) {
  var query = {
    TableName: "lib_busyness",
    ProjectionExpression: "#name, current_busyness",
    ExpressionAttributeNames: {
      "#name": "name"
    }
  };
  dynamodb.scan(query, function (err, data) {
    if (err) {
      // throw err;
      res.send(err);
    }
    res.send(data);
  });
});


//Post libinfo
app.post("/libinfo", function (req, res) {
  var infoArr = req.body;
  var arrLength = infoArr.length;
  var completed = 0;

  infoArr.forEach(info => {
    var entry = {
      TableName: "lib_info",
      Item: {
        name: info.name,
        location: info.location,
        department: info.department
      }
    };

    docClient.put(entry, function (err, data) {
      completed++;
      if (err) {
        //throw err;
        res.send(err);
      }
      if (completed == arrLength) {
        res.send("done");
      }
    });
  });
});

//Get libinfo-v2
/*
Expected Output: one big JSON object where each library is a property of the object and is organized as shown below:

"Arts Library": {
    "location": "1400 Public Affairs Building, Los Angeles, CA 90095-1392",
    "phone": "(310) 206-5425",
    "department": {
      "Arts Library": [
        {
          "dp_open_time": "1pm - 5pm",
          "date": "Su 13"
        },
        {
          "dp_open_time": "8am - 9pm",
          "date": "M 14"
        },
        {
          "dp_open_time": "8am - 9pm",
          "date": "Tu 15"
        },
        {
          "dp_open_time": "8am - 9pm",
          "date": "W 16"
        },
        {
          "dp_open_time": "8am - 9pm",
          "date": "Th 17"
        },
        {
          "dp_open_time": "8am - 5pm",
          "date": "F 18"
        },
        {
          "dp_open_time": "1pm - 5pm",
          "date": "Sa 19"
        }
      ],
      "CLICC Laptop & iPad Lending (Arts Library)": [
        {
          "dp_open_time": "1pm - 4:30pm",
          "date": "Su 13"
        },
        {
          "dp_open_time": "8am - 8:30pm",
          "date": "M 14"
        },
        {
          "dp_open_time": "8am - 8:30pm",
          "date": "Tu 15"
        },
        {
          "dp_open_time": "8am - 8:30pm",
          "date": "W 16"
        },
        {
          "dp_open_time": "8am - 8:30pm",
          "date": "Th 17"
        },
        {
          "dp_open_time": "8am - 4:30pm",
          "date": "F 18"
        },
        {
          "dp_open_time": "1pm - 4:30pm",
          "date": "Sa 19"
        }
      ],
      "Reference Desk": [
        {
          "dp_open_time": "Closed",
          "date": "Su 13"
        },
        {
          "dp_open_time": "11am - 4pm",
          "date": "M 14"
        },
        {
          "dp_open_time": "11am - 4pm",
          "date": "Tu 15"
        },
        {
          "dp_open_time": "11am - 4pm",
          "date": "W 16"
        },
        {
          "dp_open_time": "11am - 4pm",
          "date": "Th 17"
        },
        {
          "dp_open_time": "11am - 4pm",
          "date": "F 18"
        },
        {
          "dp_open_time": "Closed",
          "date": "Sa 19"
        }
      ]
    }
  }
*/

app.get("/v2/num_rooms_free_at/:day/:time", function (req, res) {
  var query = {
    TableName: "lib_info"
  };

  const client = new Client({
    user: 'studyroot',
    host: 'studysmart-db.chpjzhfmtelr.us-west-1.rds.amazonaws.com',
    database: 'mydb',
    password: 'studysmart-db',
    port: '5432'
  });

  var day = req.params.day;
  var time = req.params.time;
  client.connect();
  client.query("SELECT building, count(*) \
                FROM classroom_availabilities\
                WHERE start_time<$1 AND end_time>$2 AND day=$3\
                GROUP BY building\
                ORDER BY building",
    [time, time, day], (err1, result1) => {
      if (err1) {
        console.log(err1.stack);
        client.end();
      } else {
        res.send(result1);
        client.end();
      }
    });
});

app.get("/v2/get_rooms/:building/:day/:time", function (req, res) {
  var query = {
    TableName: "lib_info"
  };

  const client = new Client({
    user: 'studyroot',
    host: 'studysmart-db.chpjzhfmtelr.us-west-1.rds.amazonaws.com',
    database: 'mydb',
    password: 'studysmart-db',
    port: '5432'
  });

  var day = req.params.day;
  var time = req.params.time;
  var building = req.params.building;

  client.connect();
  client.query("SELECT building,room, end_time-$1  as amount_of_time\
                FROM classroom_availabilities\
                WHERE start_time<$1 AND end_time>$2 AND day=$3 AND building=$4\
                ORDER BY amount_of_time DESC",
    [time, time, day, building], (err1, result1) => {
      if (err1) {
        console.log(err1.stack);
        client.end();
      } else {
        res.send(result1);
        client.end();
      }
    });
});



app.get("/v2/get_room_timetable/:building/:room", function (req, res) {
  var query = {
    TableName: "lib_info"
  };

  const client = new Client({
    user: 'studyroot',
    host: 'studysmart-db.chpjzhfmtelr.us-west-1.rds.amazonaws.com',
    database: 'mydb',
    password: 'studysmart-db',
    port: '5432'
  });

  var building = req.params.building;
  var room = req.params.room;

  client.connect();
  client.query("SELECT * \
                FROM classroom_availabilities\
                WHERE room=$1 AND building=$2",
    [room, building], (err1, result1) => {
      if (err1) {
        console.log(err1.stack);
        client.end();
      } else {
        res.send(result1);
        client.end();
      }
    });
});



app.get("/v2/libinfo", function (req, res) {
  var query = {
    TableName: "lib_info"
  };

  const client = new Client({
    user: 'studyroot',
    host: 'studysmart-db.chpjzhfmtelr.us-west-1.rds.amazonaws.com',
    database: 'mydb',
    password: 'studysmart-db',
    port: '5432'
  });

  client.connect();
  client.query('select * from libraries', (err1, result1) => {
    if (err1) {
      console.log(err1.stack);
      client.end();
    } else {
      client.query('select * from library_hours', (err2, result2) => {
        if (err2) {
          console.log(err2.stack);
          client.end();
        } else {
          var outJson = {};
          const libData = result1.rows;
          const hrData = result2.rows;
          //create field for each library
          for (var i = 0; i < libData.length; i++) {
            var libName = libData[i].name;
            var libLoc = libData[i].location;
            var libPhone = libData[i].phone;

            outJson[libName] = {};
            outJson[libName].location = libLoc;
            outJson[libName].phone = libPhone;
            outJson[libName].department = {};
            //outJson[libName].department = [];
          }

          for (var i = 0; i < hrData.length; i++) {
            var libName = hrData[i].library_name;
            var depName = hrData[i].dep_name;
            var date = hrData[i].date;
            var times = hrData[i].times;

            if (!(depName in outJson[libName].department)) {
              outJson[libName].department[depName] = [];
            }
            var temp = { "dp_open_time": times, "date": date };
            outJson[libName].department[depName].push(temp);
          }
          res.send(outJson);
          client.end();
        }
      });
    }
  });
});

//Get studyinfo
app.get("/studyinfo", function (req, res) {
  if (
    !req.query.name &&
    !req.query.date &&
    !req.query.duration &&
    !req.query.time
  ) {
    var query = {
      TableName: "study_info"
    };

    dynamodb.scan(query, function (err, data) {
      if (err) {
        throw err;
        res.send("err");
      }
      res.send(JSON.stringify(data));
    });
  } else {
    var query = {
      TableName: "study_info"
    };

    var keyType = "";
    query.ExpressionAttributeValues = {};
    query.ExpressionAttributeNames = {};

    if (req.query.name) {
      query.IndexName = "name-index";
      query.KeyConditionExpression = "#nm = :name";
      query.ExpressionAttributeNames["#nm"] = "name";
      query.ExpressionAttributeValues[":name"] = req.query.name;
      keyType = "name";
    } else if (req.query.date) {
      query.IndexName = "date-index";
      query.KeyConditionExpression = "#dt = :date";
      query.ExpressionAttributeNames["#dt"] = "date";
      query.ExpressionAttributeValues[":date"] = req.query.date;
      keyType = "date";
    } else if (req.query.duration) {
      query.IndexName = "duration-index";
      query.KeyConditionExpression = "#dur = :duration";
      query.ExpressionAttributeNames["#dur"] = "duration";
      query.ExpressionAttributeValues[":duration"] = req.query.duration;
      keyType = "duration";
    } else if (req.query.time) {
      query.IndexName = "start-index";
      query.KeyConditionExpression = "#st = :start";
      query.ExpressionAttributeNames["#st"] = "start";
      query.ExpressionAttributeValues[":start"] = req.query.time;
      keyType = "start";
    }

    var FilterArr = [];

    if (req.query.name && keyType != "name") {
      FilterArr.push("#nm = :name");
      query.ExpressionAttributeNames["#nm"] = "name";
      query.ExpressionAttributeValues[":name"] = req.query.name;
    }
    if (req.query.date && keyType != "date") {
      FilterArr.push("#dt = :date");
      query.ExpressionAttributeNames["#dt"] = "date";
      query.ExpressionAttributeValues[":date"] = req.query.date;
    }
    if (req.query.duration && keyType != "duration") {
      FilterArr.push("#dur = :duration");
      query.ExpressionAttributeNames["#dur"] = "duration";
      query.ExpressionAttributeValues[":duration"] = req.query.duration;
    }
    if (req.query.time && keyType != "start") {
      FilterArr.push("#st = :start");
      query.ExpressionAttributeNames["#st"] = "start";
      query.ExpressionAttributeValues[":start"] = req.query.time;
    }

    if (FilterArr.length > 0) {
      query.FilterExpression = FilterArr.join(" and ");
    }

    docClient.query(query, function (err, data) {
      if (err) {
        throw err;
        res.send("err");
      }
      res.send(data);
    });
  }
});

//Post libinfo
app.post("/studyinfo", function (req, res) {
  var infoArr = req.body;
  var arrLength = infoArr.length;
  var completed = 0;

  infoArr.forEach(info => {
    var splitLink = info.Link.split("?")
      .join("=")
      .split("&")
      .join("=")
      .split("=");
    var infoName, infoDate, infoDuration, infoStart;

    for (var i = 0; i < splitLink.length; i++) {
      if (splitLink[i] == "type") {
        infoName = splitLink[i + 1];
      } else if (splitLink[i] == "date") {
        infoDate = splitLink[i + 1];
      } else if (splitLink[i] == "duration") {
        infoDuration = splitLink[i + 1];
      } else if (splitLink[i] == "start") {
        infoStart = splitLink[i + 1];
      }
    }

    var entry = {
      TableName: "study_info",
      Item: {
        link: info.Link,
        name: infoName,
        date: infoDate,
        duration: infoDuration,
        start: infoStart,
        details: info["Room Details"],
        time: info.Time
      }
    };

    setTimeout(
      e => {
        docClient.put(e, function (err, data) {
          completed++;
          if (err) {
            //throw err;
            res.send(err);
          }
          if (completed == arrLength) {
            res.send("done");
          }
        });
      },
      0,
      entry
    );
  });
});

//Get yrl&powell
//date, duration, building, start
app.get("/librooms", function(req, res) {
  if (
    !req.query.building &&
    !req.query.date &&
    !req.query.duration &&
    !req.query.start
  ) {
    var query = {
      TableName: "lib_rooms"
    };

    dynamodb.scan(query, function(err, data) {
      if (err) {
        throw err;
        res.send("err");
      }
      res.send(data);
    });
  } else {
    var query = {
      TableName: "lib_rooms"
    };

    var keyType = "";
    query.ExpressionAttributeValues = {};
    query.ExpressionAttributeNames = {};

    if (req.query.building) {
      query.IndexName = "building-index";
      query.KeyConditionExpression = "#bg = :building";
      query.ExpressionAttributeNames["#bg"] = "building";
      query.ExpressionAttributeValues[":building"] = req.query.building;
      keyType = "building";
    } else if (req.query.date) {
      query.IndexName = "date-index";
      query.KeyConditionExpression = "#dt = :date";
      query.ExpressionAttributeNames["#dt"] = "date";
      query.ExpressionAttributeValues[":date"] = req.query.date;
      keyType = "date";
    } else if (req.query.duration) {
      query.IndexName = "duration-index";
      query.KeyConditionExpression = "#dur = :duration";
      query.ExpressionAttributeNames["#dur"] = "duration";
      query.ExpressionAttributeValues[":duration"] = req.query.duration;
      keyType = "duration";
    } else if (req.query.start) {
      query.IndexName = "start-index";
      query.KeyConditionExpression = "#st = :start";
      query.ExpressionAttributeNames["#st"] = "start";
      query.ExpressionAttributeValues[":start"] = req.query.start;
      keyType = "start";
    }

    var FilterArr = [];

    if (req.query.building && keyType != "building") {
      FilterArr.push("#bg = :building");
      query.ExpressionAttributeNames["#bg"] = "building";
      query.ExpressionAttributeValues[":building"] = req.query.building;
    }
    if (req.query.date && keyType != "date") {
      FilterArr.push("#dt = :date");
      query.ExpressionAttributeNames["#dt"] = "date";
      query.ExpressionAttributeValues[":date"] = req.query.date;
    }
    if (req.query.duration && keyType != "duration") {
      FilterArr.push("#dur = :duration");
      query.ExpressionAttributeNames["#dur"] = "duration";
      query.ExpressionAttributeValues[":duration"] = req.query.duration;
    }
    if (req.query.start && keyType != "start") {
      FilterArr.push("#st = :start");
      query.ExpressionAttributeNames["#st"] = "start";
      query.ExpressionAttributeValues[":start"] = req.query.start;
    }

    if (FilterArr.length > 0) {
      query.FilterExpression = FilterArr.join(" and ");
    }

    docClient.query(query, function(err, data) {
      if (err) {
        throw err;
        res.send("err");
      }
      res.send(data);
    });
  }
});

//Post yrl & powell
/*app.post("/librooms", function(req, res) {
  var infoArr = req.body;
  var arrLength = infoArr.length;
  var completed = 0;
 // var combinedString = info.Room + "," + info["Building Name"]+ ","  + info.Capacity + ","+ info.Date+ "," + info.Day+ "," + info["Start Time"]+ "," + "30"

  infoArr.forEach(info => {
    var entry = {
      TableName: "lib_rooms",
      Item: {
        combined: info.Room + "," + info["Building Name"]+ ","  + info.Capacity + ","+ info.Date+ "," + info.Day+ "," + info["Start Time"]+ "," + "30",
        room: info.Room,
        building: info["Building Name"],
        capacity: info.Capacity,
        date: info.Date, //change to date format
        day: info.Day,
        start: info["Start Time"], //change to seconds?
        duration: "30"
      }
    };

    setTimeout(
      e => {
        docClient.put(e, function(err, data) {
          completed++;
          if (err) {
            //throw err;
            res.send(err);
          }
          if (completed == arrLength) {
            res.send("done");
          }
        });
      },
      0,
      entry
    );
  });
});*/
app.listen(process.env.PORT || 3000);
