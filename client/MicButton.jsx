var React = require('react');
var Eventful = require('eventful-react');
var util = require('./util');

var MicButton = Eventful.createClass({
  clickHandler: function() {
    util.startMicrophone(function(text) {
      util.getGeolocation(function(coordinates) {
        $.ajax({
          url: '/requestride',
          type: "POST",
          data: {
            text: text.transcript,
            coordinates: coordinates
          },
          success: function(err, response) {
            console.log(response);
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
