var requestEstimate = require('../uber_queries/requestEstimate');

module.exports = function(req, res, callback) {
  console.log("in estimateRide", req.body)
  requestEstimate(req.body.product, req.body.start_latitude, req.body.start_longitude, req.session.token, function(result) {
    console.log("in estimateRide result", result);
    res.send(result);
  });
}
