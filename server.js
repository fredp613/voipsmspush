
var express = require('express');
var app = require("express")();
var bodyParser = require('body-parser');
var User = require('./models/user_model.js');
var mongoose = require('mongoose');

var connection_string = 'mongodb://localhost/voipapidb';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
	console.log("what the hell? server.js")
  connection_string = "admin" + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;  
}

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };       
 
/*
 * Mongoose uses a different connection string format than MongoDB's standard.
 * Use the mongodb-uri library to help you convert from the standard format to
 * Mongoose's format.
 */
// var mongodbUri = 'mongodb://user:pass@host:port/db';
// var mongooseUri = uriUtil.formatMongoose(mongodbUri);
 
// mongoose.connect(mongooseUri, options);

// mongoose.connect(connection_string, options);
mongoose.connect(connection_string);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());  
                 
app.get("/users", function (req, res) {	
	res.send({"status":"success"})
});

app.get("/users/:id", function (req, res) {
	var id = req.params.id;
	var color = req.query.color;
	res.send({"status":"success"})
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
	console.log("port is:" + server_port)
	console.log("server ip address is:" + server_port)
	app.listen(server_port, server_ip_address, function () {
	  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
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


// var Animal = require("./agent/push.js");

// var john = new Animal(3);
// john.getAge();
 
console.log("you can now post, delete, get, and patch to ure site");

















