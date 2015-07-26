var request = require('superagent');

module.exports = function(requestId, token, callback) {
  request.del('https://api.uber.com/v1/requests/' + requestId)
  .set('Authorization', 'BEARER ' + token)
  .end(function(err, response) {
    callback(response.body);
  });
};
