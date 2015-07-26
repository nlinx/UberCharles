var requestRide = require('../uber_queries/requestRide');
var requestMap = require('../uber_queries/requestMap');
var speechToText = require('../speechToText');
var convertToLatLng = require('../convertToLatLng');
var scheduleHandler = require('../scheduleHandler');

var pollForMap = function(requestId, token, callback) {
  requestMap(requestId, token, function(map) {
    if (map.href) {
      callback(map);
    }
    else {
      scheduleHandler.minutes(0.25, function() {
        pollForMap(requestId, token, callback);
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
          requestRide(req.session.token, 'uberBlack', startCoordinates.latitude, startCoordinates.longitude, endCoordinates.latitude, endCoordinates.longitude, function(uberResponse) {
            console.log(uberResponse);
            res.send({request_id: uberResponse.request_id});
            // pollForMap(uberResponse.request_id, req.session.token, function(map) {
              // res.send(map);
            // });
          });
        }
        else {
          scheduleHandler.minutes(userRequest.time, function() {
            requestRide(req.session.token, 'uberX', startCoordinates.latitude, startCoordinates.longitude, endCoordinates.latitude, endCoordinates.longitude, function(uberResponse) {
              console.log(uberResponse);
              res.send({requestId: uberResponse.request_id});
              // pollForMap(uberResponse.request_id, req.session.token, function(map) {
              //   res.send(map);
              // });
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