var CronJob = require('cron').CronJob;

console.log(new Date());
new CronJob('* * * * * *', function() {
  console.log('hi');
}, null, true, "America/Los_Angeles");