var cluster = require('cluster');

var config = JSON.parse(process.env.test);
	
cluster.setupMaster({
  exec: "./" + config.queue_type + "/producer/queue_producer.js",
  args: [],
  silent: false
});

var count = 0;
for(var i=0; i < config.producers; i++) {
  var proc = cluster.fork();
  proc.on('message', function(msg) {
    count += msg.count;

    if (count === config.messages)
      process.exit();
  })
}

cluster.on('disconnect', function(worker) {
  // console.log('The worker #' + worker.id + ' has disconnected');
});

cluster.on('exit', function(worker, code, signal) {
  // console.log('worker ' + worker.process.pid + ' died');
});
