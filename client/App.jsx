var React = require('react');
var Eventful = require('eventful-react');

var MicButton = require('./MicButton');
var GeoButton = require('./GeoButton');
var MapFrame = require('./MapFrame');
var Login = require('./Login');

var App = Eventful.createClass({
  getInitialState: function() {
    return {rideInProgress: false, mapUrl: ''};
  },
  startRide: function(url) {
    this.setState({rideInProgress: true, mapUrl: url});
  },
  render: function() {
    return (
      <div>
        <Login />
        <div className='container-default'>
          <MicButton startRide={this.startRide}/>
          <GeoButton />
          <div className='map-container'>
            <MapFrame  url={this.state.mapUrl}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = App;
