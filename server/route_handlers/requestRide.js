var requestRide = require('../uber_queries/requestRide');
var requestMap = require('../uber_queries/requestMap');
var speechToText = require('../speechToText');
var convertToLatLng = require('../convertToLatLng');
var scheduleHandler = require('../scheduleHandler');
var redis = require('../redis');

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
  // if (req.body.text.indexOf('Charles') === -1 && req.body.text.indexOf('chiles') === -1) {
  //   return res.send(false);
  // }

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
            if (uberResponse.errors && uberResponse.errors[0].status === 409) {
              redis.set(uberResponse.meta.surge_confirmation.surge_confirmation_id, JSON.stringify({
                startCoordinates: startCoordinates,
                endCoordinates: endCoordinates,
                product: 'uberX'
              }));
              res.send({success: false, code: 'surge', url: uberResponse.meta.surge_confirmation.href, surgeId: uberResponse.meta.surge_confirmation.surge_confirmation_id});
            }
            else {
              res.status(201).send({success: true, requestId: uberResponse.request_id});
            }
          });
        }
        else {
          scheduleHandler.minutes(userRequest.time, function() {
            requestRide(req.session.token, 'uberX', startCoordinates.latitude, startCoordinates.longitude, endCoordinates.latitude, endCoordinates.longitude, function(uberResponse) {
              console.log(uberResponse);
              if (uberResponse.errors && uberResponse.errors[0].status === 409) {
                console.log(uberResponse.meta.surge_confirmation.surge_confirmation_id);
                redis.set(uberResponse.meta.surge_confirmation.surge_confirmation_id, {
                  startCoordinates: startCoordinates,
                  endCoordinates: endCoordinates,
                  product: 'uberX'
                });
                res.send({success: false, code: 'surge', url: uberResponse.meta.surge_confirmation.href, surgeId: uberResponse.meta.surge_confirmation.surge_confirmation_id});
              }
              else {
                res.status(201).send({success: true, requestId: uberResponse.request_id});
              }
            });
          });
        }
      });
    }
    else {
      return res.send(null);
    }
  });


  console.log('startCoordinates: ', startCoordinates);
};
