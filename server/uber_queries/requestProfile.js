var request = require('superagent');

module.exports = function(token, callback) {
  request.get('api.uber.com/v1/me')
  .set('Authorization', 'BEARER ' + token)
  .end(function(err, response) {
    callback(response.body);
  });
}