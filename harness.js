var child_process = require('child_process'),
  config = require('config'),
  async = require('async');

async.forEachSeries(config.test_cases, function(test, cb) {
  console.log(test.name);
  process.env.test = JSON.stringify(test);

  before_each(function() {
    var start = new Date();

    var producer = child_process.spawn('node', ['harness_producer'], {stdio: 'inherit'});
    var consumer = child_process.spawn('node', ['harness_consumer'], {stdio: 'inherit'});

    var finished = 0;
    producer.on('exit', function() {
      ++finished;
      console.log('Producer time:', new Date() - start);
      if (finished === 2)
        cb();
    });

    consumer.on('exit', function() {
      ++finished;
      console.log('Consumer time:', new Date() - start);
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
