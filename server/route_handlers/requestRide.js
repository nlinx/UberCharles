var requestRide = require('../uber_queries/requestRide');
var speechToText = require('../speechToText');
var convertToLatLng = require('../convertToLatLng');

module.exports = function(req, res, callback) {
  //convert destination to end longitude and latitude with nathans function
  if (req.body.text.indexOf('Charles') === -1) {
    return res.send('Charles did not answer');
  }

  var text = req.body.text;
  var startCoordinates = req.body.coordinates;
  var endCoordinates;

  var userRequest;
  speechToText(text, function(request) {
    if (request && request.request === 'request_ride') {
      userRequest = request;
      console.log('userRequest: ', userRequest);
      convertToLatLng(userRequest.destination, function(coordinates) {
        endCoordinates = coordinates;
        console.log('endCoordinates', endCoordinates);
      });
    }
    else {
      return res.send('Charles did not understand you!');
    }
  });

  console.log('startCoordinates: ', startCoordinates);
};