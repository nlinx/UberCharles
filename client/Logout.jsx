var React = require('react');
var util = require('./util');

var Logout = Eventful.createClass({
  clickHandler: function() {
  },
  render: function() {
    return <div className='logoutButton' onClick={this.clickHandler}>Logout</div>;
  }
});

module.exports = Logout;