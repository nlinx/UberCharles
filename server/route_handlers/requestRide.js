var requestRide = require('../uber_queries/requestRide');
var speechToText = require('../speechToText');

module.exports = function(req, res, callback) {
  //convert destination to end longitude and latitude with nathans function
  if (req.query.text.indexOf('Charles') === -1) {
    res.send('Charles did not answer');
  }

  console.log(req.query);
};