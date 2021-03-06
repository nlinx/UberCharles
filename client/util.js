var getGeolocation = function(cb) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(res) {
      cb({
        latitude: res.coords.latitude,
        longitude: res.coords.longitude
      });
    });
  }
};

var startMicrophone = function(setMessage, cb) {
  var recognition = new webkitSpeechRecognition();
  recognition.onstart = function() {
    setMessage('I\'m listening...');
  };
  recognition.lang = "en-GB";
  recognition.onresult = function(event) {
    setMessage('Certainly. Searching for a car as we speak...');
    var result = event.results[0][0];
    cb({
      transcript: result.transcript,
      confidence: result.confidence
    });
  };
  recognition.start();
};

var cancelRide = function(requestId, cb) {
  $.ajax({
    url: '/cancelride',
    type: 'GET',
    data: {
      requestId: requestId
    },
    success: function(data, status, xhr) {
      cb();
    }
  });
}

var getEstimate = function(cb) {
  getGeolocation(function(latLng) {
    $.ajax({
      url: '/estimate',
      type: 'POST',
      data: {
        product:'uberBlack',
        start_latitude: latLng.latitude,
        start_longitude: latLng.longitude
      },
      success: function(data, status, xhr) {
        cb(data);
      }
    });
  })
}

var speak = function(text) {
  responsiveVoice.speak(text, "UK English Male");
}

module.exports = {
  getGeolocation: getGeolocation,
  startMicrophone: startMicrophone,
  cancelRide: cancelRide,
  getEstimate: getEstimate,
  speak: speak
};

