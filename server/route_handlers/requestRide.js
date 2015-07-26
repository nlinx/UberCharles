var requestRide = require('../uber_queries/requestRide');
var requestMap = require('../uber_queries/requestMap');
var speechToText = require('../speechToText');
var convertToLatLng = require('../convertToLatLng');
var scheduleHandler = require('../scheduleHandler');

var pollForMap = function(uberResponse, token) {
  requestMap(uberResponse.request_id, req.session.token, function(map) {
    if (map.href) {
      res.send(map);
    }
    else {
      scheduleHandler.minutes(0.25, function() {
        pollForMap(uberResponse, token);
      });
    }
  });
};

module.exports = function(req, res, callback) {
  console.log('token is: ', req.session.token);
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
        if (userRequest.time === 0) {
          requestRide(req.session.token, 'uberX', startCoordinates.latitude, startCoordinates.longitude, endCoordinates.latitude, endCoordinates.longitude, function(uberResponse) {
            console.log(uberResponse);
            pollForMap(uberResponse.request_id, req.session.token);
          });
        }
        else {
          scheduleHandler.minutes(userRequest.time, function() {
            requestRide(req.session.token, 'uberX', startCoordinates.latitude, startCoordinates.longitude, endCoordinates.latitude, endCoordinates.longitude, function(uberResponse) {
              console.log(uberResponse);
              pollForMap(uberResponse.request_id, req.session.token);
            });
          });
        }
      });
    }
    else {
      return res.send('Charles did not understand you!');
    }
  });


  console.log('startCoordinates: ', startCoordinates);
};