
var method = CleanupMessages.prototype;
var async = require('async')
var request = require('request');

var User = require('./models/user_model.js');
var Message = require('./models/message_model.js');
var async = require('async')

function CleanupMessages() {};


	method.go = function() {
		 var today = new Date()
		 Message.find({created_at: { $lt: today }}).remove().exec();
		 console.log("messages deleted")
		 // setTimeout(CleanupMessages.go, 3000);
		 setTimeout(CleanupMessages.go, 36000000);
	}

module.exports = CleanupMessages;