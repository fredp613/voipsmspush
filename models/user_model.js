

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
  email: {type: String, required: true},  
  password: { type: String, required: true },  
  did: {type: String, required: true},
  device_token: { type: String, required: true },  
  user_active: Boolean, 
  created_at: {type: Date, required: true},
  updated_at: {type: Date, required: true}
});

var User = mongoose.model('Voip_User', userSchema);

module.exports = User;