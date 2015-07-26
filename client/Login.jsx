var React = require('react');
var util = require('./util');

var Login = Eventful.createClass({
  clickHandler: function() {
    window.location.href= "/login"
  },
  render: function() {
    return <div className='login btn btn-default' onClick={this.clickHandler}>Login</div>;
  }
});

module.exports = Login;