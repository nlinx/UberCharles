var CronJob = require('cron').CronJob;
// var Storage = require('redis').createClient();

var setJob = {
  'now': function(callback) {
    //calls the uber
    console.log('now');
  },
  'minutes': function(minutes, callback) {
    new CronJob(new Date((new Date()).getTime() + minutes*60000), function() {
      //calls the uber
    console.log('minutes');
    }, null, true, 'America/Los_Angeles');
  },
  'hours': function(hours, callback) {
    new CronJob(new Date((new Date()).getTime() + hours*3600000), function() {
      //calls the uber
    console.log('hours');
    }, null, true, 'America/Los_Angeles');
  }
};

module.exports = setJob;
