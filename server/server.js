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
    'redirect_uri': 'http://localhost:3000/authorization',
    'code': authorizationCode
  })
  .end(function(err, response) {
    var accessToken = response.body.access_token;
    requestProfile(accessToken, function(profile) {
      req.session.user = profile;
      req.session.token = accessToken;
      res.send(profile);
    });
  });
});

app.get('/rideTest', function(req, res) {
  var reqRide = req.query;
  console.log('token: ', req.session.token);
  requestRide(req.session.token, reqRide.product, reqRide.start_latitude, reqRide.start_longitude, reqRide.end_latitude, reqRide.end_longitude, function(response) {
    console.log(response);
    var requestId = response.request_id;
    changeRideStatus(requestId, req.session.token, 'accepted', function(map) {
      console.log(map);
      requestStatus(requestId, req.session.token, function(status) {
        console.log(status);
        cancelRide(requestId, req.session.token, function(canceled) {
          console.log(canceled);
          requestStatus(requestId, req.session.token, function(status) {
            console.log(status);
          });
        });
      });
    });
  });
});

var requestRide = require('./route_handlers/requestRide');
app.get('/requestride', requestRide);

//error handling middleware applied last
app.use(errorHandler);

var server = app.listen(port, function() {
  console.log("Express server listening on %d in %s mode", port, app.settings.env);
});
