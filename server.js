
var express = require('express');
var app = require("express")();
var bodyParser = require('body-parser');
var User = require('./models/user_model.js');
var mongoose = require('mongoose');

// default to a 'localhost' configuration:
var connection_string = 'mongodb://localhost/voipapidb';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
	console.log("test")
  connection_string = "admin" + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
  // console.log(connection_string)
}

mongoose.connect(connection_string);


// var dbURL = 'mongodb://localhost/voipapidb';
// if(process.env.OPENSHIFT_MONGODB_DB_URL) {
//   dbURL = process.env.OPENSHIFT_MONGODB_DB_URL +
//     process.env.OPENSHIFT_APP_NAME;
// }

// var db = mongoose.connect(
//     dbURL,
//     function(err) {
//     	  if(err) {
// 					console.log("Error loading the db..." + err);
//     	  }        
//     });

// var db = mongoose.connect(dbURL)

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());  
                 
app.get("/users", function (req, res) {
	console.log("The req parameter contains request info");
	console.log(req);
	console.log("And the res the response information");
	console.log(res);
	res.send("Logged the request and response");
});

app.get("/users/:id", function (req, res) {
	var id = req.params.id;
	var color = req.query.color;
	res.send("Yes? You asked for customer '" + id +
		"' and passed the color = '" + color + "'");
});

app.post("/users", function (req, res) {
	console.log(req.body);
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

	User.findOne({deviceToken: u.deviceToken}, function(){

	})
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

app.post("/users", function (req, res) { res.send("all the HTTP verb looks the same");});
app.patch("/users", function (req, res) { res.send("all the HTTP verb looks the same");});
app.del("/users", function (req, res) { res.send("all the HTTP verb looks the same");});


if (process.env.OPENSHIFT_NODEJS_PORT) {
	var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
	var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
	app.listen(server_port, server_ip_address, function () {
	  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
	});
} else {
	app.listen(3000);
}


var PushLoop = require('./agent/push.js');
var pushLoop = new PushLoop();
pushLoop.startPushLoop();

// var Animal = require("./agent/push.js");

// var john = new Animal(3);
// john.getAge();
 
console.log("you can now post, delete, get, and patch to ure site");

















