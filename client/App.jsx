var React = require('react');
var Eventful = require('eventful-react');

var MicButton = require('./MicButton');
var GeoButton = require('./GeoButton');

var App = Eventful.createClass({
  render: function() {
    return (
      <div>
        <MicButton />
        <GeoButton />
      </div>
    );
  }
});

module.exports = App;
