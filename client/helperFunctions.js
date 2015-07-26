var getGeolocation = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(res) {
      var longitude = res.coords.longitude;
      var latitude = res.coords.latitude;
      console.log(res.coords.latitude, res.coords.longitude)
    });
  }
}

var startMicrophone = function() {
  var recognition = new webkitSpeechRecognition();
  recognition.lang = "en-GB";
  recognition.onresult = function(event) {
    console.log(event.results[0][0].transcript)
  }
  recognition.start();
}
