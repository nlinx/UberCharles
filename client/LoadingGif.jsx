var React = require('react');
var Eventful = require('eventful-react');
var util = require('./util');

var LoadingGif = Eventful.createClass({
  render: function() {
    var imageClass = 'notLoading'
    if (this.props.loading) {
      imageClass = 'loading';
    } else {
      imageClass = 'notLoading';
    }
    return <img className={imageClass} src="http://sierrafire.cr.usgs.gov/images/loading.gif" />
  }
});

module.exports = LoadingGif;
