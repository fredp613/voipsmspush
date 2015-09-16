/*!
 * This example demonstrates apnagent's ability
 * to connect to the feedback service. Unless you
 * have feedback response waiting, it probably won't
 * do anything.
 *
 * To trigger a feedback event uninstall your application
 * from the device then send several notifications. It may
 * take some time for your device to show up on feedback.
 */

/*!
 * Module dependencies
 */
var method = Feedback.prototype;
// var agent = require('../agent/_header') 
var apnagent = require('apnagent')

var apnagent = require('apnagent')
  , auth = require('../agent/_header').auth;


var join = require('path').join
  , pfx = join(__dirname, '../certs/voipsms.p12'), pfxProd = join(__dirname, '../certs/voipsmsprod.p12');

/**
 * Construct Feedback
 */


function Feedback() {};

  method.go = function() {
    
  /**
   * Provide settings and connect
   */
   var feedback = new apnagent.Feedback();

    feedback
    .set('pfx file', pfxProd)  
  // .set("passphrase", "Gabriella614$")
    .set("passphrase", process.env.CERT_PASS)
    .enable('production')
    .connect(function (err) {
      if (err && 'FeedbackAuthorizationError' === err.name) {
        console.log('%s: %s', err.name, err.message);
        process.exit(1);
      } else if (err) {
        throw err;
      } else {
        console.log('feedback running');
      }
    });

    /**
     * Provide first handle
     */

    feedback.use(function (device, ts, next) {
      console.log('[feedback-1] %s', device.toString());
      setTimeout(next, 300000);
    });

    /**
     * Provide second handle
     */

    feedback.use(function (device, ts, next) {
      console.log('[feedback-2] %s', device.toString());
      setTimeout(next, 300000);
    });
  } 

module.exports = Feedback;

