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
      loading: false
    };
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

  render: function() {
    return (
      <div>
        <Login />
        <div className='container-default'>
          <MicButton loadingFunc={this.loading} notLoadingFunc={this.notLoading} startRide={this.startRide}/>
          <GeoButton />
          <CancelButton requestId={this.state.requestId} stopRide={this.stopRide}/>
          <div>
            <EstimateButton setEstimates={this.setEstimates} />
          </div>
          <div>
            <PricingInfo surge={this.state.surge} price={this.state.price} />
          </div>
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
