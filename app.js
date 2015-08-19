
var express = require('express');
var app = require("express")();
var bodyParser = require('body-parser');
var User = require('./models/user_model.js');

var mongoose = require('mongoose');

var url = 'mongodb://localhost/voipapidb';

if(process.env.OPENSHIFT_MONGODB_DB_URL) {
  url = process.env.OPENSHIFT_MONGODB_DB_URL +
    process.env.OPENSHIFT_APP_NAME;
}

var db = mongoose.connect(
    url,
    function(err) {
        console.log("Error loading the db..." + err);
    });

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
			  res.send({"status":"success"})			  
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
// and HEAD and OPTIONS and what have you... 

app.listen(3000);
console.log("you can now post, delete, get, and patch to ure site");