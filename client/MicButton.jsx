var React = require('react');
var Eventful = require('eventful-react');
var util = require('./util');

var MicButton = Eventful.createClass({
  clickHandler: function() {
    var pollForMap = function(requestId) {
      $.ajax({
        url: '/map?request_id=' + requestId,
        type: "GET",
        success: function(data, status, xhr) {
          console.log('data: ', data);
          console.log('status: ', status);
          console.log('xhr: ', xhr);
          if (xhr.status === 400) {
            setTimeout(function() {
              pollForMap(requestId);
            },500);
          }
          else {
            var startRide = that.props.startRide;
            startRide(data.href);
          }
        }
      });
    };
    var that = this;
    util.startMicrophone(function(text) {
      util.getGeolocation(function(coordinates) {
        $.ajax({
          url: '/requestride',
          type: "POST",
          data: {
            text: text.transcript,
            coordinates: coordinates
          },
          success: function(data, status, xhr) {
            pollForMap(data.requestId);
          }
        });
        console.log(text);
      })
    });
  },
  render: function() {
    return <div className="buttonMic btn btn-primary" onClick={this.clickHandler}>Text-to-speech</div>;
  }
});

module.exports = MicButton;
