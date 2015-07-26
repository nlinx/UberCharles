var wit = require('node-wit');
var witKey = require('./config').WIT_KEY;

var witFunction = function(text, callback) {
  wit.captureTextIntent(witKey, text, function (err, response) {
    if (err) console.log('Error: ', err);

    if (response.outcomes[0].intent === 'schedule_ride' || response.outcomes[0].intent === 'take_me_to') {
      var destination = response.outcomes[0].entities.location[0].value;
      if (response.outcomes[0].intent === 'schedule_ride') {
        var time = response.outcomes[0].entities.duration[0].value;
      }
      callback({
        request: 'request_ride',
        destination: destination,
        time: time || 0
      });
    } else {
      // intentFunctions[response.outcomes[0].intent]();
      callback(null);
    }
    // callback(response.outcomes[0].intent);
  });
}

module.exports = witFunction;

    // var latLngs = {};
    // latLngs.start.lat = data.start.lat;
    // latLngs.start.lng = data.start.lng;

      // convertToLatLng(endLocation, function(endLatLng) {
      //   latLngs.end.lat = endLatLng.end.lat;
      //   latLngs.end.lng = endLatLng.end.lng;
      //   console.log(latLngs);
      //   // intentFunctions[response.outcomes[0].intent](latLngs, time);
      // });