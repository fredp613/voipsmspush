
// var agent = require('../app')
// var mongoose = require('mongoose');


// var mongonURIstr = 'mongodb://localhost/voipapidb'

// mongoose.connect(mongonURIstr, function (err, res) {
//   if (err) {
//   console.log ('ERROR connecting to: ' + mongonURIstr + '. ' + err);
//   } else {
//   console.log ('Succeeded connected to: ' + mongonURIstr);
//   }
// });

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
//   var voipUserSchema = mongoose.Schema({
//     email: String,
//     pwd: String
// 	});
// 	var user = mongoose.model('voipUserSchema', voipUserSchema);		
// });

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// mongoose.connect('mongodb://localhost/voipapidb');
  
// create a schema
var userSchema = new Schema({
  email: {type: String, required: true},  
  password: { type: String, required: true },  
  did: {type: String, required: true},
  device_token: { type: String, required: true },  
  user_active: Boolean, 
  created_at: {type: Date, required: true},
  updated_at: {type: Date, required: true}
});

// userSchema.methods.getAllUsers = function (u) {
//   return this.model('Voip_User').find();
// }


// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('Voip_User', userSchema);

// make this available to our users in our Node applications
module.exports = User;