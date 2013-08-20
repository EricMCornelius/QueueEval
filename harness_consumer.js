var cluster = require('cluster'),
  config = require('config');

cluster.setupMaster({
  exec: "./rabbit/consumer/queue_consumer.js",
  args: [],
  silent: false
});

var config = config.test_cases[0];

for(var i=0; i < config.consumers; i++) {
  cluster.fork({test_index:process.env.test_index});
}

cluster.on('exit', function(worker, code, signal) {
  console.log('worker ' + worker.process.pid + ' died');
});
