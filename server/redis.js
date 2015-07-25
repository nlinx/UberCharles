var redis = require('redis');
var publisher = redis.createClient();

module.exports = publisher;