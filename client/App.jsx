var React = require('react');
var Eventful = require('eventful-react');

var MicButton = require('./MicButton');
var GeoButton = require('./GeoButton');
var Login = require('./Login');

var App = Eventful.createClass({
  render: function() {
    return (
      <div>
        <Login />
        <div className='container-default'>
          <MicButton />
          <GeoButton />
        </div>
      </div>
    );
  }
});

module.exports = App;
