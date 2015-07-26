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
          if (!data.success) {
            setTimeout(function() {
              pollForMap(requestId);
            },5000);
          }
          else {
            console.log(data.map.href);
            var startRide = that.props.startRide;
            startRide(data.map.href);
          }
        },
        failure: function() {
          alert('i suck');
        }
      });
    };
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
            pollForMap(data.requestId);
            var startRide = that.props.startRide;
            console.log(data);
            if (data) {
              util.speak('Your Uber has been called. Please stand by.');
              startRide(data.href, data.request_id);
            } else if (data === '') {
              util.speak('Incorrect information was stated. Please try again.')
            } else {
              util.speak('My name is not Chiles. I am Sir Charles the Third of Wales, half brother of the Duke of England and son of the Bishop of Saint Petersberg');
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
