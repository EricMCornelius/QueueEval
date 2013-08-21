var child_process = require('child_process'),
  config = require('config'),
  async = require('async');

async.forEachSeries(config.test_cases, function(test, cb) {
  console.log(test.name);
  process.env.test = JSON.stringify(test);

  before_each(function() {
    var producer = child_process.spawn('node', ['harness_producer'], {stdio: 'inherit'});
    var consumer = child_process.spawn('node', ['harness_consumer'], {stdio: 'inherit'});

    var finished = 0;
    producer.on('exit', function() {
      ++finished;
      if (finished === 2)
        cb();
    });

    consumer.on('exit', function() {
      ++finished;
      if (finished === 2)
        cb();
    });
  });
});

function before_each(cb) {
  if (config.redis) {
    var redis = require('redis');
    var client = redis.createClient();
    client.del('my-queue');
    client.quit();
  }
  
  cb();
}
