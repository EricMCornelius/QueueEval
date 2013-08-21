var cluster = require('cluster');

var config = JSON.parse(process.env.test);

cluster.setupMaster({
  exec: "./zmq/consumer/queue_consumer.js",
  args: [],
  silent: false
});

var count = 0;
for(var i=0; i < config.consumers; i++) {
  var proc = cluster.fork({test_index:process.env.test_index});
  proc.on('message', function(msg) {
    count += msg.count;

    if (count % 100 === 0)
      console.log(count);

    if (count === config.iterations)
      process.exit();
  })
}

cluster.on('disconnect', function(worker) {
  // console.log('The worker #' + worker.id + ' has disconnected');
});

cluster.on('exit', function(worker, code, signal) {
  // console.log('worker ' + worker.process.pid + ' died');
});

process.on('message', function(msg) {
  console.log('received message from consumer worker');
  console.log(msg);
})