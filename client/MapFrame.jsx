var React = require('react');
var Eventful = require('eventful-react');

var MapFrame = Eventful.createClass({
  render: function() {
    var mapClass;
    if (this.props.showMap) {
      mapClass = 'visible';
    } else {
      mapClass = 'notVisible';
    }
    mapClass += " mapFrame"
    return <iframe className={mapClass} style={{border: 'none'}} src={this.props.url}></iframe>;
  }
});

module.exports = MapFrame;
