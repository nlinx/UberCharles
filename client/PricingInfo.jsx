var React = require('react');
var Eventful = require('eventful-react');
var util = require('./util');

var PricingInfo = Eventful.createClass({
  render: function() {
    return (
      <div>
        <div>Surge: {this.props.surge}</div>
        <div>Price Estimate: {this.props.price}</div>
      </div>
    );
  }
});

module.exports = PricingInfo;
