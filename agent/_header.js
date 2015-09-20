/*!
 * APN Agent - Scenario Connection Header
 * @see
 */

/*
// uncomment section to enable debug output
process.env.DEBUG = process.env.DEBUG
  ? process.env.DEBUG + ',apnagent:*'
  : 'apnagent:*';
*/

/*!
 * Locate your certificate
 */

var aws = require('aws-sdk');

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;


var s3 = new aws.S3();
 var s3_params = {
        Bucket: S3_BUCKET,
        Key: null,
        Expires: 60,
        ContentType: null,
        ACL: 'public-read'
    };


var bucket = new aws.S3(s3_params);


  bucket.listObjects(function (err, data) {
    if (err) {
      console.log(err)
    } else {     
      for (var i = 0; i < data.Contents.length; i++) {
        console.log(data.Contents[i].key)
      }
    }
  });

 
var join = require('path').join
  , pfx = join(__dirname, '../certs/voipsms.p12'), pfxProd = join(__dirname, '../certs/voipsmsprod.p12')

console.log(pfx)

 

/*!
 * Create a new gateway agent
 */

var apnagent = require('apnagent')
  , agent = module.exports = new apnagent.Agent();

  // see error mitigation section
  agent.on('message:error', function (err, msg) {
    console.log("there is an APN agent error:" + err)
  });ps

 module.exports = {    
    pfx: pfx
    // agent: new apnagent.Agent()
}



var async = require('async')



/*!
 * Configure agent
 */

agent
  .set('pfx file', pfx)  
  .set("passphrase", process.env.CERT_PASS)
  .enable('sandbox');

/*!
 * Error Mitigation
 */


agent.on('message:error', function (err, msg) {
  switch (err.name) {
    // This error occurs when Apple reports an issue parsing the message.
    case 'GatewayNotificationError':
      console.log('[message:error] GatewayNotificationError: %s', err.message);

      // The err.code is the number that Apple reports.
      // Example: 8 means the token supplied is invalid or not subscribed
      // to notifications for your application.
      if (err.code === 8) {
        console.log('    > %s', msg.device().toString());
        // In production you should flag this token as invalid and not
        // send any futher messages to it until you confirm validity
      }

      break;

    // This happens when apnagent has a problem encoding the message for transfer
    case 'SerializationError':
      console.log('[message:error] SerializationError: %s', err.message);
      break;

    // unlikely, but could occur if trying to send over a dead socket
    default:
      console.log('[message:error] other error: %s', err.message);
      break;
  }
});

/*!
 * Make the connection
 */

agent.connect(function (err) {
  // gracefully handle auth problems
  if (err && err.name === 'GatewayAuthorizationError') {
    console.log('Authentication Error: %s', err.message);
    process.exit(1);
  }

  // handle any other err (not likely)
  else if (err) {
    throw err;
  }

  function profile() {
    console.log("profile")
  }

  // it worked!
  var env = agent.enabled('sandbox')
    ? 'sandbox'
    : 'production';

  console.log('apnagent [%s] gateway connected', env);
  
});














