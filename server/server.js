var config = require('./config');
var errorHandler = require('./errorHandler');
// var db = require('./db');
var parser = require('body-parser');
var redis = require('./redis');
var OAuth = require('node-oauth');
var morgan = require('morgan');

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
  var authorizationCode = req.query;
  res.send(authorizationCode);
});

//error handling middleware applied last
app.use(errorHandler);

var server = app.listen(port, function() {
  console.log("Express server listening on %d in %s mode", port, app.settings.env);
});
