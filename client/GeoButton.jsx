var React = require('react');
var Eventful = require('eventful-react');
var util = require('./util');

var GeoButton = Eventful.createClass({
  clickHandler: function() {
    util.getGeolocation(console.log.bind(console));
  },
  render: function() {
    return <div className="button" onClick={this.clickHandler}>Geolocation</div>;
  }
});

module.exports = GeoButton;
