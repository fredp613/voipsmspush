

var method = PushLoop.prototype;
var agent = require('./_header')  
var request = require('request');
var User = require('../models/user_model.js');
var Message = require('../models/message_model.js');
var async = require('async')

function PushLoop() {};

	method.startPushLoop = function() {

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
		 // console.log("getUserMessages")
		 async.eachSeries(users, function (user, callback) {

			  var params = {
				  email: user.email,
		 	  	pwd: user.password,
		 	  	token: user.device_token
			  }		  		  		  
				  messageRequest(params)		  			  		 
			  callback(); 
			}, function (err) {
			  if (err) {
			  	console.log(err)
					setTimeout(getUserList, 3000)			  	 
			  } 			  
			});
	}

	function messageRequest(params) {
		  
			var url = "https://voip.ms/api/v1/rest.php?api_username="+ params.email +"&api_password="+ params.pwd +"&method=getSMS&type=1&limit=5"					 					
			request(url, function(err, response, body){ 
				// console.log(body)
				if (!err) {
					var responseObject = JSON.parse(body);			        					  	
			  	var messages = responseObject.sms	
					if (responseObject["status"] == "success")  {					  	    						  								  							
						async.eachSeries(messages, function(message, callback){					
							saveMessage(message, params.token)
							callback();

						}, function(err) {
							if (err) {
								console.log(err)
							}
							// setTimeout(getUserList, 3000) 							
						})
					} else {
						// setTimeout(getUserList, 3000)	
					}
				} else {
					console.log(err)
					// setTimeout(getUserList, 3000)
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
				  date: message.date,
				  created_at: new Date().toLocaleString(),
				  updated_at: new Date().toLocaleString()   
				});			  	
			  m.save(function(e) {
				  	if (e) {
				  		console.log(e)
				  	}	else {
				  		 agent.createMessage()			  	 
						  .device(token)
						  .alert(message.message)
						  .set('contact', message.contact)
						  .set('did', message.did)
						  .set('id', message.id)
						  .set('date', message.date)
						  .set('message', message.message)					  
						  .send();
				  	}					  			  		
				});
		  } //else {			    							  		  	
		  // }	 											  		
		});	
	}

};

module.exports = PushLoop;






    


