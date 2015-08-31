
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  message_id: {type: String, required: true},    
  did: {type: String, required: true}, 
  contact: {type: String, required: true},  
  message: {type: String, required: true}, 
  date: {type: String, required: true}, 
  created_at: {type: Date, required: true},
  updated_at: {type: Date, required: true},
  device_token: {type: String, required: true}
});

messageSchema.methods.existingMessage = function (cb) {
	console.log("from model: " + this.message_id);
  return this.model('Voip_sMessage').find( { message_id: this.message_id }, cb);
}

var Message = mongoose.model('Voip_Message', messageSchema);
module.exports = Message;