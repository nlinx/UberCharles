var React = require('react');
var Eventful = require('eventful-react');
var util = require('./util');

var MicButton = Eventful.createClass({
  clickHandler: function() {
    util.startMicrophone(console.log.bind(console));
  },
  render: function() {
    return <div className="button" onClick={this.clickHandler}>Text-to-speech</div>;
  }
});

module.exports = MicButton;
