var request = require('superagent');

module.exports = function(token, product, start_latitude, start_longitude, end_latitude, end_longitude, callback, surgeId) {
  var products = {
    'uberTaxi': '3ab64887-4842-4c8e-9780-ccecd3a0391d',
    'uberSuv': '8920cb5e-51a4-4fa4-acdf-dd86c5e18ae0',
    'uberBlack': 'd4abaae7-f4d6-4152-91cc-77523e8165a4',
    'uberXL': '821415d8-3bd5-4e27-9604-194e4359a449',
    'uberX': 'a1111c8c-c720-46c3-8534-2fcdd730040d',
  };

  var rideData = {
    'product_id': products[product],
    'start_latitude': start_latitude,
    'start_longitude': start_longitude,
    'end_latitude': end_latitude,
    'end_longitude': end_longitude,
  }

  if (surgeId) {
    rideData.surge_confirmation_id = surgeId;
  }

  request.post('https://api.uber.com/v1/requests')
  .set('Authorization', 'BEARER ' + token)
  .send(rideData)
  .end(function(err, response) {
    callback(response.body);
  });
}