var React = require('react');
var Eventful = require('eventful-react');

var MapFrame = Eventful.createClass({
  render: function() {
    return <iframe className="mapFrame" style={{border: 'none'}} src={this.props.url}></iframe>;
  }
});

module.exports = MapFrame;