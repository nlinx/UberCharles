var config = require('./config');
var errorHandler = require('./errorHandler');
// var db = require('./db');
var parser = require('body-parser');
var redis = require('./redis');
var OAuth = require('node-oauth');
var morgan = require('morgan');
var request = require('superagent');

var express = require('express');
var port = process.env.PORT || 3000;

var app = express();

app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

//Auth
app.get('/login', function(req, res) {
  res.redirect('https://login.uber.com/oauth/authorize?client_id=' + config.UBER_CLIENT_ID + '&response_type=code');
});
app.get('/authorization', function(req, res) {
  //capture authorization code from uber --- valid for 10 minutes
  var authorizationCode = req.query.code;
  console.log(authorizationCode);
  request.post('https://login.uber.com/oauth/token')
  .query({
    'client_secret': config.UBER_SECRET,
    'client_id': config.UBER_CLIENT_ID,
    'grant_type': 'authorization_code',
    'redirect_uri': 'http://localhost:3000/authorization',
    'code': authorizationCode
  })
  .end(function(err, response) {
    res.send(response.text);
  });
});

//error handling middleware applied last
app.use(errorHandler);

var server = app.listen(port, function() {
  console.log("Express server listening on %d in %s mode", port, app.settings.env);
});
