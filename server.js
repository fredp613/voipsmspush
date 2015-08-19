
var express = require('express');
var app = require("express")();
var bodyParser = require('body-parser');
// var User = require('./models/user_model.js');
var mongoose = require('mongoose');
var agent = require('./_header')  
var request = require('request');
var User = require('../models/user_model.js');
var Message = require('../models/message_model.js');
var async = require('async')

// if(process.env.OPENSHIFT_NODEJS_PORT) {
// 	app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
// 	app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");	
// }

var dbURL = 'mongodb://localhost/voipapidb';
if(process.env.OPENSHIFT_MONGODB_DB_URL) {
  dbURL = process.env.OPENSHIFT_MONGODB_DB_URL +
    process.env.OPENSHIFT_APP_NAME;
}

var db = mongoose.connect(
    dbURL,
    function(err) {
    	  if(err) {
					console.log("Error loading the db..." + err);
    	  }        
    });

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


getUserList()

function getUserList() {
	User.find({}, function(err, users) {
		if (err) throw err;
		if (users.length > 0) {
			 getUserMessages(users)	
		} else {
			setTimeout(getUserList, 3000)
		}		 		 	
	});
}

function getUserMessages(users) {

	 async.eachSeries(users, function (user, callback) {

		  var params = {
			  email: user.email,
	 	  	pwd: user.password,
	 	  	token: user.device_token
		  }		  		  		  
			  messageRequest(params)		  			  		 
		  callback(); // Alternatively: callback(new Error());
		}, function (err) {
		  if (err) { throw err; }		  	 
		});
}

function messageRequest(params) {
	  
		var url = "https://voip.ms/api/v1/rest.php?api_username="+ params.email +"&api_password="+ params.pwd +"&method=getSMS&type=1&limit=5"					 					
		request(url, function(err, response, body){ 
			console.log(body)
			if (!err) {
				var responseObject = JSON.parse(body);			        					  	
		  	var messages = responseObject.sms	
				if (responseObject["status"] == "success") /** && message does not exist in db  **/ {					  	    						  								  							
					async.eachSeries(messages, function(message, callback){					
						saveMessage(message, params.token)
						callback();

					}, function(err) {
						if (err) throw err;					
						setTimeout(getUserList, 3000)
					})
				} else {
					setTimeout(getUserList, 3000)	
				}
			} else {
				setTimeout(getUserList, 3000)
			}			
		});
}
	
function saveMessage(message, token) {
	Message.findOne({ message_id: message.id}, function (err, doc){	  
	  if (!doc) {	  	
	  	var m = new Message({
			  message_id: message.id, 
			  did: message.did,
			  contact: message.contact, 
			  message: message.message,
			  created_at: new Date().toLocaleString(),
			  updated_at: new Date().toLocaleString()   
			});	
	  	console.log(token)
		  m.save(function(e) {
			  	if (e) throw e;		
			  	 agent.createMessage()			  	 
					  .device(token)
					  .alert(message.message)
					  .set('contact', message.contact)
					  .set('did', message.did)
					  .set('id', message.id)
					  .set('date', message.date)
					  .set('message', message.message)					  
					  .send();		  
					  console.log(token)																												
			});
	  } else {			    							  		  	
	  }	 											  		
	});	
//contact, id, date, message, did
}








if (process.env.OPENSHIFT_NODEJS_PORT) {
	var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
	var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
	app.listen(server_port, server_ip_address, function () {
	  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
	});
} else {
	app.listen(3000);
}
 
console.log("you can now post, delete, get, and patch to ure site");

















