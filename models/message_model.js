
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// mongoose.connect('mongodb://localhost/voipapidb');

// create a schema
var messageSchema = new Schema({
  message_id: {type: String, required: true},    
  did: {type: String, required: true}, 
  contact: {type: String, required: true},  
  message: {type: String, required: true}, 
  date: {type: String, required: true}, 
  created_at: {type: Date, required: true},
  updated_at: {type: Date, required: true}
});

messageSchema.methods.existingMessage = function (cb) {
	console.log("from model: " + this.message_id);
  return this.model('Voip_sMessage').find( { message_id: this.message_id }, cb);
}

// the schema is useless so farq
// we need to create a model using it
var Message = mongoose.model('Voip_Message', messageSchema);

// make this available to our users in our Node applications
module.exports = Message;