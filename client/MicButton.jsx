var React = require('react');
var Eventful = require('eventful-react');
var util = require('./util');

var MicButton = Eventful.createClass({
  clickHandler: function() {
    var that = this;
    util.startMicrophone(function(text) {
      util.getGeolocation(function(coordinates) {
        $.ajax({
          url: '/requestride',
          type: 'POST',
          data: {
            text: text.transcript,
            coordinates: coordinates
          },
          success: function(data, status, xhr) {
            var startRide = that.props.startRide;
            startRide(data.href, data.request_id);
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
