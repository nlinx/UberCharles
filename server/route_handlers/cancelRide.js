var cancelRide = require('../uber_queries/cancelRide');

module.exports = function(req, res, callback) {
  console.log("in cancelRide", req.query)
  cancelRide(req.query.requestId, req.session.token, function(result) {
    console.log("in cancelRide result", result);
    res.send(result);
  });
}
