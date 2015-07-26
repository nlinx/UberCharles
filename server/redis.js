var redis = require('redis');
var publisher;
if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  publisher = redis.createClient(rtg.port, rtg.hostname);
  publisher.auth(rtg.auth.split(":")[1]);
}
else {
  publisher = redis.createClient();
}

module.exports = publisher;