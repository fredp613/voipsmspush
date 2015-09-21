

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
			// Async task (same in all examples in this chapter)
			function async(arg, callback) {
			  // console.log('do something with \''+arg.device_token+'\', return 1 sec later');

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
									// var update = {
									// 	message_id: message.id, 
									//   did: message.did,
									//   contact: message.contact, 
									//   message: message.message,
									//   date: message.date,
									//   created_at: new Date().toLocaleString(),
									//   updated_at: new Date().toLocaleString(),
									//   device_token: arg.device_token 
									// }
									// var update = {$set: message.toObject()}
									// var options = { upsert: true, 'new': true  }

						  			Message.findOne( query, function (err, doc){
												  			// Message.findOneAndUpdate(query,update,options,function(err, doc) {						  				  						  				  						  				  																				  					
						  					 if (!doc || doc == null) {						  					 	 
	  					 								message.save(function(e) {
	  					 									console.log("message saved")
	  					 									if (e) {
	  					 										console.log("there is an error")
	  					 										console.log(e)
	  					 									} else {
	  					 										  					 											  					 									
	  					 								// 		apnagent.createMessage()			  	 
																 //  .device(message.device_token)																  
																 //  .alert(message.message)
																 //  .set('contact', message.contact)
																 //  .set('did', message.did)
																 //  .set('id', message.message_id)
																 //  .set('date', message.date)
																 //  .set('message', message.message)					  
																	// .send(function(e) {
																	// 	console.log(e)
																	// });	
																	// console.log("ok at end of message")

	  					 								// 	}
	  					 										console.log(message.device_token)
	  					 										var sanitizedMessage = message.message.toString('utf-8')

	  					 										var payload = {
	  					 											"contact" : message.contact,
	  					 											"did" : message.did,
	  					 											"id" : message.message_id,
	  					 											"date" : message.date,
	  					 											"message" : message.message
	  					 										}	  					 										
			  					 								var note = new apns.Notification();
			  					 								//note encoding = ut8 toggle this!
			  					 								var myDevice = new apns.Device(message.device_token);
																	note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
																	note.badge = 3;																	
																	note.alert = message.contact + ": " + sanitizedMessage;
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
				// var pushLoop = new PushLoop();
				// process.nextTick(pushLoop.go())
			}

			series(userArr.shift())
		});
	}
}
	

module.exports = PushLoop;















    


