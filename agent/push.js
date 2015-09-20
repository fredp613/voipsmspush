

var method = PushLoop.prototype;
// var agent = require('./_header')  
var request = require('request');
var User = require('../models/user_model.js');
var Message = require('../models/message_model.js');
var async = require('async')
var apnagent = require('apnagent')

var apns = require('apn');

// var root = process.cwd();

// var fs = require('fs');

var options = {
    cert: root + '../certs/aps_development.pem',                 /* Certificate file path */
    certData: null,                   /* String or Buffer containing certificate data, if supplied uses this instead of cert file path */
    key:  root + '../certs/key-development.pem',                  /* Key file path */
    keyData: null,                    /* String or Buffer containing key data, as certData */
    passphrase: process.env.CERT_PASS,                 /* A passphrase for the Key file */
    ca: null,                         /* String or Buffer of CA data to use for the TLS connection */
    gateway: 'gateway.sandbox.push.apple.com',/* gateway address */
    port: 2195,                       /* gateway port */
    enhanced: true,                   /* enable enhanced format */
    errorCallback: undefined,         /* Callback when error occurs function(err,notification) */
    cacheLength: 100                  /* Number of notifications to cache for error purposes */
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
				  			console.log(m.id)

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
						  				  // console.log(doc.message)
						  				  console.log(doc ? "existing message" : doc);
						  				  																				  					
						  					 if (!doc || doc == null) {
						  					 	  console.log("new message")

	  					 								message.save(function(e) {
	  					 									console.log("message saved")
	  					 									if (e) {
	  					 										console.log("there is an error")
	  					 										console.log(e)
	  					 									} else {
	  					 										console.log("there isnt an error")	  					 											  					 									
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
			  					 								var note = new apn.Notification();
																	note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
																	note.badge = 3;
																	note.sound = "ping.aiff";
																	note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
																	note.payload = {'messageFrom': 'Caroline'};

																	apnConnection.pushNotification(note, message.device_token);
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















    


