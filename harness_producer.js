var cluster = require('cluster'),
  config = require('config');
	
cluster.setupMaster({
  exec: "./rabbit/producer/queue_producer.js",
  args: [],
  silent: false
});

var config = config.test_cases[0];

for(var i=0; i < config.producers; i++) {
  cluster.fork({test:0});
}

cluster.on('exit', function(worker, code, signal) {
  console.log('worker ' + worker.process.pid + ' died');
});
