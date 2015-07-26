var CronJob = require('cron').CronJob;

console.log(new Date());

new CronJob('* * * * *', function() {
  //checks every minute for Uber calls that need to be done.
}, null, true, "America/Los_Angeles");
