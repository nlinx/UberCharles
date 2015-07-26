var React = require('react');
var Eventful = require('eventful-react');
var util = require('./util');

var CancelButton = Eventful.createClass({
  clickHandler: function() {
    util.cancelRide(this.props.requestId, this.props.stopRide);
    this.props.notCancelFunc();
    this.props.setMessage('Hi, I\'m Charles. Where are we going today?');
  },
  render: function() {
    var cancelClass;
    if (this.props.cancelable) {
      cancelClass = 'visible';
    } else {
      cancelClass = 'notVisible';
    }
    var newClassName = "button btn btn-primary " + cancelClass;
    return <div className={newClassName} onClick={this.clickHandler}>Cancel</div>;
  }
});

module.exports = CancelButton;
