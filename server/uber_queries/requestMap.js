var request = require('superagent');

module.exports = function(requestId, token, callback) {
  request.get('api.uber.com/v1/requests/' + requestId + '/map')
  .set('Authorization', 'BEARER ' + token)
  .end(function(err, response) {
    callback(response.body);
  });
};