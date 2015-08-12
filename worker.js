var async = require('async')
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/voipapidb');
var request = require('request');

var User = require('./models/user_model.js');
var Message = require('./models/message_model.js');
var async = require('async')

deleteOldMessages()

function deleteOldMessages() {
	 var today = new Date()
	 Message.find({created_at: { $lt: today }}).remove().exec();
	 console.log("messages deleted")
	 setTimeout(deleteOldMessages, 36000000);
}