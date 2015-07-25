var config = require('./config');
var errorHandler = require('./errorHandler');
// var db = require('./db');
var parser = require('body-parser');
var redis = require('./redis');
var uberApi = require('./uberApi');
var OAuth = require('node-oauth');

var express = require('express');
var port = process.env.PORT || 3000;

var app = express();

//I think you can use both? Just pick whichever we need.
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/client'));

//ROUTES
app.get('/login', function(req, res) {
  res.redirect('https://login.uber.com/oauth/authorize?client_id=' + uberApi.clientId + '&response_type=code');
});

//error handling middleware applied last
app.use(errorHandler);

var server = app.listen(port, function() {
  console.log("Express server listening on %d in %s mode", port, app.settings.env);
});