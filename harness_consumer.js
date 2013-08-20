var cluster = require('cluster'),
  config = require('config');

console.log("setupMaster");
cluster.setupMaster({
  exec: "./rabbit/consumer/queue_consumer.js",
  // args: testIds,
  silent: false
});

for(var i=0; i<config.consumers; i++){
  console.log("forking:" + i);
  cluster.fork({test:0});
}

cluster.on('exit', function(worker, code, signal) {
  console.log('worker ' + worker.process.pid + ' died');
});
