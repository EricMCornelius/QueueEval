var child_process = require('child_process'),
  config = require('config'),
  async = require('async');

async.map(config.test_cases, function(test, cb) {
  async.map(['harness_producer.js', 'harness_consumer.js'], function(script, cb) {
    var proc = child_process.spawn('node', [script], { stdio: 'inherit' });
    proc.on('error', cb);
    proc.on('exit', cb);
  }, cb);
});
