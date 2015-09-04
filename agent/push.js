

var method = PushLoop.prototype;
var agent = require('./_header')  
var request = require('request');
var User = require('../models/user_model.js');
var Message = require('../models/message_model.js');
// var async = require('async')


function PushLoop() {};

	

	// A simple async series:
	var items = [ 1, 2, 3, 4, 5, 6 ];

	

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
			  console.log('do something with \''+arg.device_token+'\', return 1 sec later');

			  	var url = "https://voip.ms/api/v1/rest.php?api_username="+ arg.email +"&api_password="+ arg.password +"&method=getSMS&type=1&limit=5"					 					
					
					request.get(url, {timeout: 30000}, function(err, response, body){ 
						if (!err) {											
							var responseObject = JSON.parse(body);			        					  	
					  	var messages = responseObject.sms	
					  	var status = responseObject.status
					  	if (status === "success") {
					  		console.log("success")

					  		messages.forEach(function(m) {
// $and: [ { price: { $ne: 1.99 } }, { price: { $exists: true } } ] }
												  			Message.findOne( $and : [{message_id: m.id}, {device_token:m.device_token}], function (err, doc){

																  					 if (doc == undefined || !doc) {
																  					
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


																					  			message.save(function(e) {
																									  	if (e) {						  		
																									  		console.log(e)
																									  	}	else {
																									  		console.log("send a msg")
																									  		// Send Notification
																									  		// var apnConnection = new apn.Connection(options);

																																// try {
																																//     // Set the relevant parameters
																																//     var note = new apn.Notification();
																																//     note.expiry = Math.floor(Date.now() / 1000) + 3600; // 1h from now
																																//     note.badge = 3;
																																//     note.sound = "ping.aiff";
																																//     note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
																																//     note.payload = {
																																//         'messageFrom': 'Caroline'
																																//     };
																																//     agent.pushNotification(note, message.device_token);
																																// } catch (ex) {
																																//     sails.log.error('sending APN failed. Error=', ex);
																																//     console.log(ex)
																																// }

																									  		 agent.createMessage()			  	 
																											  .device(message.device_token)
																											  .alert(message.message)
																											  .set('contact', message.contact)
																											  .set('did', message.did)
																											  .set('id', message.id)
																											  .set('date', message.date)
																											  .set('message', message.message)					  
																											  .send(function(e) {
																											  	if (e) {
																											  		console.log(e)
																											  	} else {
																											  		console.log("message sent")
																											  	}

																											  });								  
																									  	}					  			  		
																									});	

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










	// method.startPushLoop = function() {

	//  getUserList()

	// function getUserList() {		

	// 	User.find({}, function(err, users) {			
	// 		if (err) throw err;
	// 		if (users.length > 0) {				 
	// 			 getUserMessages(users)	
	// 		} else {			  
	// 			setTimeout(getUserList, 3000)
	// 		}		 		 	
	// 	});
	// }

	




// 	function getUserMessages(users) {
// 		 // console.log("getUserMessages")
// 		 async.eachSeries(users, function (user, callback) {

// 			  var params = {
// 				  email: user.email,
// 		 	  	pwd: user.password,
// 		 	  	token: user.device_token
// 			  }		  		  		  
// 				  messageRequest(params)		  			  		 
// 			  callback(); 
// 			}, function (err) {
// 			  if (err) {
// 			  	console.log(err)
// 					setTimeout(getUserList, 3000)			  	 
// 			  } 			  
// 			});
// 	}

// 	function messageRequest(params) {
		  
// 			var url = "https://voip.ms/api/v1/rest.php?api_username="+ params.email +"&api_password="+ params.pwd +"&method=getSMS&type=1&limit=5"					 					
// 			request.get(url, {timeout: 1500}, function(err, response, body){ 
// 				// console.log(err.code === 'ETIMEDOUT')
// 				// console.log(err.connect === true)
// 				if (!err) {
				
// 					var responseObject = JSON.parse(body);			        					  	
// 			  	var messages = responseObject.sms	

// 					if (responseObject["status"] == "success")  {					  	    						  								  							
// 						async.eachSeries(messages, function(message, callback){		
// 						  console.log(params.token)			
// 							saveMessage(message, params.token)
// 							callback();

// 						}, function(err) {
// 							if (err) {
// 								console.log(err)
// 							}														
// 						})
// 					} else {						
// 					}
// 				} else {
// 					console.log(err)					
// 				}			

// 			});			
// 	}
		
// 	function saveMessage(message, token) {



// 			Message.findOne({message_id: message.id}, function (err, doc){
			
// 		  if (!doc) {	  				 
// 				  console.log('emtpy today')			  	
// 				  	var m = new Message({
// 						  message_id: message.id, 
// 						  did: message.did,
// 						  contact: message.contact, 
// 						  message: message.message,
// 						  date: message.date,
// 						  created_at: new Date().toLocaleString(),
// 						  updated_at: new Date().toLocaleString(),
// 						  device_token: token  	 
// 						});			  	
// 					  m.save(function(e) {
// 						  	if (e) {						  		
// 						  		console.log(e)
// 						  	}	else {
// 						  		 agent.createMessage()			  	 
// 								  .device(token)
// 								  .alert(message.message)
// 								  .set('contact', message.contact)
// 								  .set('did', message.did)
// 								  .set('id', message.id)
// 								  .set('date', message.date)
// 								  .set('message', message.message)					  
// 								  .send();								  
// 						  	}					  			  		
// 						});		  
// 		  }	 											  		
// 		}) //.limit(1);	
// 	}

// };








    


