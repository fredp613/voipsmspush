
var express = require('express');
var app = require("express")();
var bodyParser = require('body-parser');
var User = require('./models/user_model.js');
var mongoose = require('mongoose');


var debug = require('debug')('apn')
  , http = require('http')
  , name = 'my little app';

var connection_string = 'mongodb://localhost/voipapidb';

if (process.env.MONGOLAB_URI) {
	connection_string = process.env.MONGOLAB_URI	
}

app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/script'));
app.use(express.static(__dirname + '/images'));

console.log("connection string is:" + connection_string)

mongoose.connect(connection_string, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});
app.use(bodyParser()); 
app.use(bodyParser.json());  


app.get("/", function (req, res) {	
	res.sendFile("index.html")
});

app.get("/users", function (req, res) {	
	res.send({"status":"success"})
});

app.get("/users/:id", function (req, res) {
	var id = req.params.id;
	var color = req.query.color;
	res.send({"status":"success"})
});

app.get("isregistered/:token", function(req, res) {
	var token = req.params.token;
	User.findOne({ device_token: token}, function (err, doc){	  
		if (err) console.log(err);
	  if (!doc) {			  	
			res.send({"isRegistered":"false"});
	  } else {
	  	 res.send({"isRegistered":"true"});			  
	  }
	}); 

})

app.post("/users", function (req, res) {
	// console.log(req.body);
	var email = req.body.user.email;
	var pwd = req.body.user.pwd;
	var did = req.body.user.did;
	var deviceToken = req.body.user.device;
		
	var u = new User({
	  email: email,
	  password: pwd,	  
	  did: did,
	  device_token: deviceToken,
	  user_active: true,	  
	  created_at: new Date().toLocaleString(),
	  updated_at: new Date().toLocaleString()   
	});

	

	User.findOne({ device_token: u.device_token}, function (err, doc){	  
		if (err) console.log(err);
	  if (!doc) {			  	
			u.save(function(err) {					  	  
			  console.log('User created successfully!');			  
			  res.send({"status":"successWithoutDoc"})			  
			});
	  } else {
	  	  doc.email = u.email,
			  doc.password = u.pwd,	  
			  doc.did = u.did,
			  doc.device_token = u.deviceToken,
			  doc.user_active = true,	  			  
			  updated_at = new Date().toLocaleString()
			  doc.save();
			  res.send({"status":"success"})			  
	  }
	});  
});

// app.post("/users", function (req, res) { res.send("all the HTTP verb looks the same");});
// app.patch("/users", function (req, res) { res.send("all the HTTP verb looks the same");});
// app.del("/users", function (req, res) { res.send("all the HTTP verb looks the same");});

if (process.env.PORT) {
	app.listen(process.env.PORT || 5000, function () {	  
			
	});
} else {
	app.listen(3000);
}


var PushLoop = require('./agent/push.js');
var pushLoop = new PushLoop();
pushLoop.go()

var Feedback = require('./feedback/live.js');
var feedback = new Feedback();
feedback.go();

var CleanupMessages = require('./worker.js');
var cleanUpmessages = new CleanupMessages();
cleanUpmessages.go();


 


















