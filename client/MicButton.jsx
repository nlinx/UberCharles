var React = require('react');
var Eventful = require('eventful-react');
var util = require('./util');

var MicButton = Eventful.createClass({
  clickHandler: function() {
    var that = this;
    var pollForMap = function(requestId, surge) {
      console.log(requestId);
      var query;
      if (surge) {
        query = '/map?surge_id='
      }
      else {
        query = '/map?request_id=';
      }
      $.ajax({
        url: query + requestId,
        type: "GET",
        success: function(data, status, xhr) {
          console.log('data: ', data);
          console.log('status: ', status);
          console.log('xhr: ', xhr);
          if (!data.success) {
            setTimeout(function() {
              pollForMap(requestId, surge);
            },5000);
          }
          else {
            that.props.notLoadingFunc();
            console.log(data.map.href);
            var startRide = that.props.startRide;
            startRide(data.map.href);
          }
        }
      });
    };
    var that = this;
    util.startMicrophone(function(text) {
      that.props.loadingFunc();
      that.props.cancelFunc();
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
            console.log(data);
            var requestId;
            if (data.success) {
              util.speak('Your Uber has been called. Please stand by.');
              startRide(data.href, data.request_id);
              pollForMap(data.requestId, false);
              var startRide = that.props.startRide;
            } else if (data === '') {
              util.speak('Incorrect information was stated. Please try again.')
              that.props.notLoadingFunc();
              that.props.cancelFunc();
            } else if (data.success === false && data.code === 'surge') {
              pollForMap(data.surgeId, true);
              var startRide = that.props.startRide;
              util.speak('Uber is surging. Are you ok with that? Please confirm.')
              window.open(data.url,'1437919483550','width=700,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
            }
            else {
              that.props.notLoadingFunc();
              that.props.cancelFunc();
              util.speak('My name is not Chiles you upstart!');
            }
          }
        });
        console.log(text);
      })
    });
  },
  render: function() {
    return <div className="buttonMic btn btn-primary" onClick={this.clickHandler}>Tell Charles</div>;
  }
});

module.exports = MicButton;
