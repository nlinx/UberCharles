var React = require('react');
var Eventful = require('eventful-react');

var MicButton = require('./MicButton');
var GeoButton = require('./GeoButton');
var CancelButton = require('./CancelButton')
var EstimateButton = require('./EstimateButton')
var PricingInfo = require('./PricingInfo');
var LoadingGif = require('./LoadingGif');
var MapFrame = require('./MapFrame');
var Login = require('./Login');

var App = Eventful.createClass({
  getInitialState: function() {
    return {
      rideInProgress: false,
      mapUrl: '',
      requestId: undefined,
      surge: 'Unknown',
      price: 'Unknown',
      loading: false,
      cancelable: false,
      message: 'Hi, I\'m Charles. Where are we going today?'
    };
  },
  setMessage: function(newMessage) {
    var that = this;
    that.setState({message: newMessage});
  },
  startRide: function(url, requestId) {
    this.setState({
      rideInProgress: true,
      mapUrl: url,
      requestId: requestId
    });
  },
  stopRide: function() {
    this.setState({
      rideInProgress: false,
      mapUrl: '',
      requestId: undefined,
      surge: 'Unknown',
      price: 'Unknown'
    });
  },
  setEstimates: function(surge, price) {
    this.setState({
      surge: surge,
      price: price || 'Unknown'
    })
  },
  loading: function() {
    this.setState({loading: true});
  },
  notLoading: function() {
    this.setState({loading: false});
  },
  cancelable: function() {
    this.setState({cancelable: true});
  },
  notCancelable: function() {
    this.setState({cancelable: false});
  },

  render: function() {
    return (
      <div>
        <div className='container-default'>
          <MicButton loadingFunc={this.loading} cancelable={this.state.cancelable} message={this.state.message} setMessage={this.setMessage} notLoadingFunc={this.notLoading} cancelFunc={this.cancelable} notCancelFunc={this.notCancelable} startRide={this.startRide}/>
          <CancelButton requestId={this.state.requestId} setMessage={this.setMessage} notCancelFunc={this.notCancelable} stopRide={this.stopRide} cancelable={this.state.cancelable}/>
          <div>
            <LoadingGif loading={this.state.loading}/>
          </div>
          <div className='map-container'>
            <MapFrame  url={this.state.mapUrl}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = App;
