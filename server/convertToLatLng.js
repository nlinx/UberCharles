var request = require('superagent');

var convertToLatLng = function(address, callback) {
  request
  .get('http://maps.googleapis.com/maps/api/geocode/json?')
  .query({address: address})
  .end(function(err, res) {
    callback(res.body.results[0].geometry.location);
  });
}

module.exports = convertToLatLng;