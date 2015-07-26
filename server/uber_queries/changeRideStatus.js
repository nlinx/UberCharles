var request = require('superagent');

module.exports = function(requestId, token, status, callback) {
  request.put('https://sandbox-api.uber.com/v1/sandbox/requests/' + requestId)
  .set('Authorization', 'BEARER ' + token)
  .send({'status': status})
  .end(function(err, response) {
    callback(response.body);
  });
};