var config = require('./config');
var errorHandler = require('./errorHandler');

var parser = require('body-parser');
var redis = require('./redis');
var OAuth = require('node-oauth');
var morgan = require('morgan');
var request = require('superagent');

var requestProfile = require('./uber_queries/requestProfile');
var requestRide = require('./uber_queries/requestRide');
var requestMap = require('./uber_queries/requestMap');
var requestStatus = require('./uber_queries/requestStatus');
var cancelRide = require('./uber_queries/cancelRide');
var changeRideStatus = require('./uber_queries/changeRideStatus');

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var express = require('express');
var port = process.env.PORT || 3000;

var app = express();

//sessions
app.use(session({
  store: new RedisStore({client: redis}),
  secret: 'charlesincharge'
}));

//I think you can use both? Just pick whichever we need.
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

//Auth
app.get('/login', function(req, res) {
  var scopes = 'profile history history_lite request request_receipt';
  res.redirect('https://login.uber.com/oauth/authorize?client_id=' + config.UBER_CLIENT_ID + '&response_type=code&scope=' + scopes);
});

app.get('/authorization', function(req, res) {
  //capture authorization code from uber --- valid for 10 minutes
  var authorizationCode = req.query.code;
  request.post('https://login.uber.com/oauth/token')
  .query({
    'client_secret': config.UBER_SECRET,
    'client_id': config.UBER_CLIENT_ID,
    'grant_type': 'authorization_code',
    'redirect_uri': 'https://ubercharles.herokuapp.com/authorization',
    'code': authorizationCode
  })
  .end(function(err, response) {
    var accessToken = response.body.access_token;
    requestProfile(accessToken, function(profile) {
      req.session.user = profile;
      req.session.token = accessToken;
      res.redirect('/');
    });
  });
});

app.get('/map', function(req, res) {
  var sendMap = function(requestId, req) {
    requestMap(requestId, req.session.token, function(map) {
      if (map.href) {
        res.status(200).send({success: true, map: map});
      }
      else {
        res.status(200).send({success: false, map: null});
      }
    });
  }
  var requestId;
  if (req.query.request_id) {
    requestId =req.query.request_id;
    sendMap(requestId, req);
  } 
  else if (req.query.surge_id) {
    redis.get(req.query.surge_id, function(err, requestId) {
    sendMap(requestId, req);
    });
  }
});

var requestRideHandler = require('./route_handlers/requestRide');
var cancelRideHandler = require('./route_handlers/cancelRide');
var estimateRideHandler = require('./route_handlers/estimateRide');
// var surge = require('./route_handlers/surge');
app.post('/requestride', requestRideHandler);
app.get('/cancelride', cancelRideHandler);
app.post('/estimate', estimateRideHandler);

app.get('/surge', function(req, res) {
  var surgeId = req.query.surge_confirmation_id;
  console.log('surgeId: ', surgeId);
  console.log('query: ', req.query);
  redis.get(surgeId, function(err, rideRequest) {
    rideRequest = JSON.parse(rideRequest);
    if (err) throw err;
    var startCoordinates = rideRequest.startCoordinates;
    var endCoordinates = rideRequest.endCoordinates;
    requestRide(req.session.token, rideRequest.product, startCoordinates.latitude, startCoordinates.longitude, endCoordinates.latitude, endCoordinates.longitude, function(uberResponse) {
      res.sendFile(__dirname + '/public/close.html');
      console.log(uberResponse);
      redis.set(surgeId, uberResponse.request_id);
    }, surgeId);
  });
});

app.post('/webhook', function(req, res) {
  console.log(req);
});

app.get('/webhook', function(req, res) {
  console.log(req);
});

//error handling middleware applied last
app.use(errorHandler);

var server = app.listen(port, function() {
  console.log("Express server listening on %d in %s mode", port, app.settings.env);
});
console.log(server.timeout);
