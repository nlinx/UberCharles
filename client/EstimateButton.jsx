var React = require('react');
var Eventful = require('eventful-react');
var util = require('./util');

var EstimateButton = Eventful.createClass({
  clickHandler: function() {
    var that = this;
    util.getEstimate(function(results) {
      console.log(results.price.surge_multiplier, results.pickup_estimate);
      that.props.setEstimates(results.price.surge_multiplier, results.pickup_estimate)
    });
  },
  render: function() {
    return <div className="button btn btn-primary" onClick={this.clickHandler}>Estimate Prices</div>;
  }
});

module.exports = EstimateButton;
