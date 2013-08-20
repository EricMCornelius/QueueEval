var child_process = require('child_process'),
  config = require('config'),
  async = require('async');

var count = 0;
async.forEachSeries(config.test_cases, function(test, cb) {
  console.log(test.name);
  process.env.test_index = count++;

  pre_hook(function() {
    var producer = child_process.spawn('node', ['harness_producer'], {stdio: 'inherit'});
    var consumer = child_process.spawn('node', ['harness_consumer'], {stdio: 'inherit'});

    producer.on('exit', function() {
      setTimeout(function() {
        consumer.kill();
        cb();
      }, test.flush_interval);
    });
  });
});

function pre_hook(cb) {
  var redis = require('redis');
  var client = redis.createClient();
  client.del('my-queue');
  client.quit();
  cb();
}