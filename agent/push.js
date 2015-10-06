

var method = PushLoop.prototype;
// var agent = require('./_header')  
var request = require('request');
var User = require('../models/user_model.js');
var Message = require('../models/message_model.js');
var async = require('async')
var apnagent = require('apnagent')
var validator = require('validator');

var apns = require('apn');

// var root = process.cwd();

// var fs = require('fs');
var join = require('path').join

process.env.PWD = process.cwd();
// path.join(process.env.PWD, 'public')
var options1 = {
    cert: join(process.env.PWD, '/certs/aps-production.pem'),                 /* Certificate file path */                       
    key: join(process.env.PWD, '/certs/key-production.pem'),                  /* Key file path */    
    passphrase: process.env.CERT_PASS,    
    gateway: 'gateway.sandbox.push.apple.com',/* gateway address */
    port: 2195,                       /* gateway port */
    enhanced: true,                   /* enable enhanced format */    
    cacheLength: 100                  /* Number of notifications to cache for error purposes */
};

var callback = function(errorNum, notification){
		console.log('Error is: %d', errorNum);
		console.log("erasfasdfsdf is %d", notification);
}

var options = {
    cert: join(process.env.PWD, '/certs/aps-production.pem'),                 /* Certificate file path */                       
    certData: null,
    key:  join(process.env.PWD, '/certs/key-production.pem'),                  /* Key file path */        
    keyData: null,
    production: true,    
    passphrase: null,    
    ca: null,
    gateway: 'gateway.push.apple.com',
    port: 2195,
    enhanced: true,
    errorCallback: callback,
    cacheLength: 100
};


var apnsConnection = new apns.Connection(options);




function PushLoop() {};

	var results = [];	
	method.go = function() {
		var userArr = [];
		startLoop()

		function startLoop() {	
			
		User.find({},function(err, users) {			
			if (err) throw err;
			users.forEach(function(u) {				
				userArr.push(u)							
			})						
			function async(arg, callback) {
			  
			  	var url = "https://voip.ms/api/v1/rest.php?api_username="+ arg.email +"&api_password="+ arg.password +"&method=getSMS&type=1&limit=5"					 					
					
					request.get(url, {timeout: 30000}, function(err, response, body){ 
						if (!err) {											
							var responseObject = JSON.parse(body);			        					  	
					  	var messages = responseObject.sms	
					  	var status = responseObject.status
					  	if (status === "success") {
					  		

				  		messages.forEach(function(m) {
				  			
				  			var message = new Message({
									  message_id: m.id, 
									  did: m.did,
									  contact: m.contact, 
									  message: m.message,
									  date: m.date,
									  created_at: new Date().toLocaleString(),
									  updated_at: new Date().toLocaleString(),
									  device_token: arg.device_token  	 
									});					  			
									var query = { $and : [{message_id: m.id}, {device_token: arg.device_token}] }
									var query1 = { message_id: m.id }


						  			Message.findOne( query, function (err, doc){

						  					 if (!doc || doc == null) {						  					 	 
	  					 								message.save(function(e) {
	  					 									console.log("message saved")
	  					 									if (e) {
	  					 										console.log("there is an error")
	  					 										console.log(e)
	  					 									} else {
	  					 										  					 											  					 										  					 							
	  					 										console.log(message.device_token)

	  					 										var payload = {
	  					 											"contact" : message.contact,
	  					 											"did" : message.did,
	  					 											"id" : message.message_id,
	  					 											"date" : message.date,
	  					 											"message" : JSON.stringify(message.message);
	  					 										}	  					 										
			  					 								var note = new apns.Notification();
			  					 								var myDevice = new apns.Device(message.device_token);
																	note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
																	note.badge = 3;																	
																	note.alert = message.contact + ": " + message.message;
																	note.payload = payload;
																	apnsConnection.pushNotification(note, myDevice);																	
																}
	  					 								})											  																									  									  
												  	}					  			  																													  			
									  		});	
										});				  		
					  	}
						  else {
						  	console.log(err)
						  }
						}					
					});	
			  
			  setTimeout(function() { 			  
			  	callback(arg + "testing 12"); 
			  }, 1000);
			}
			// Final task (same in all the examples)			
			function series(item) {
				  if(item) {
				    async( item, function(result) {				    					    	
				      results.push(result);	      
				      return series(userArr.shift());
				    });
				  } else {
				    return final();
				  }
			}
			function final() { 
				console.log('Done'); 
				startLoop();
			}

			series(userArr.shift())
		});
	}
}
	

module.exports = PushLoop;















    


