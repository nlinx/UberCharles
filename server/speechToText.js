var witFunction = function(data, callback) {
  data = JSON.parse(data);
  wit.captureTextIntent(witKey, data.text, function (err, response) {
    console.log('Response from Wit for text input: ');
    if (err) console.log('Error: ', err);
    console.log(JSON.stringify(response, null, ' '));

    var latLngs = {};
    latLngs.start.lat = data.start.lat;
    latLngs.start.lng = data.start.lng;
    if (response.outcomes[0].intent === 'schedule_ride' || response.outcomes[0].intent === 'take_me_to') {
      var endLocation = response.outcomes[0].entities.location[0].value;
      convertToLatLng(endLocation, function(endLatLng) {
        latLngs.end.lat = endLatLng.end.lat;
        latLngs.end.lng = endLatLng.end.lng;
        if (response.outcomes[0].intent === 'schedule_ride') {
          var time = response.outcomes[0].entities.duration[0].value;
        }
        console.log(latLngs);
        // intentFunctions[response.outcomes[0].intent](latLngs, time);
      });
    }else {
      // intentFunctions[response.outcomes[0].intent]();
    }
    callback(response.outcomes[0].intent);
  });
}

module.exports = witFunction;