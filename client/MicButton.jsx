var React = require('react');
var Eventful = require('eventful-react');
var util = require('./util');

var MicButton = Eventful.createClass({
  clickHandler: function() {
    var that = this;
    util.startMicrophone(function(text) {
      that.props.loadingFunc();
      util.getGeolocation(function(coordinates) {
        $.ajax({
          url: '/requestride',
          type: 'POST',
          data: {
            text: text.transcript,
            coordinates: coordinates
          },
          success: function(data, status, xhr) {
            that.props.notLoadingFunc();
            var startRide = that.props.startRide;
            console.log(data);
            if (data) {
              util.speak('Your Uber has been called. Please stand by.');
              startRide(data.href, data.request_id);
            } else if (data === '') {
              util.speak('Incorrect information was stated. Please try again.')
            } else {
              util.speak('My name is not Chiles you idiot.');
            }
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
