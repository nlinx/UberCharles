var React = require('react');
var Eventful = require('eventful-react');
var util = require('./util');

var CancelButton = Eventful.createClass({
  clickHandler: function() {
    util.cancelRide(this.props.requestId, this.props.stopRide);
  },
  render: function() {
    return <div className="button btn btn-primary" onClick={this.clickHandler}>Cancel</div>;
  }
});

module.exports = CancelButton;
