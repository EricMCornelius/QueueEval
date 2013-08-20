var cluster = require('cluster'),
  config = require('config');

cluster.setupMaster({
  exec : "./rabbit/consumer/queue_producer.js",
  // args: process.argv.slice(2),
  silent : false
});

for(var i=0; i<config.consumers; i++){
  cluster.fork();
}

cluster.on('exit', function(worker, code, signal) {
  console.log('worker ' + worker.process.pid + ' died');
});
