var amqp = require('amqp'),
  cluster = require('cluster');

module.exports.start = function(config){

  if (cluster.isMaster) {
    for (var i = 0; i < config.consumers-1; i++) {
      cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
      console.log('worker ' + worker.process.pid + ' died');
    });
  }
  console.log("consumer start");
  var connection = amqp.createConnection({ host: 'localhost' });

  // Wait for connection to become established.
  connection.on('ready', function () {
    console.log('consumer ready');

    connection.queue('my-queue', function(q){
        // Catch all messages
        q.bind('#');

        // Receive messages
        q.subscribe(function (message) {
          // Print messages to stdout
          console.log(message);
        });
    });
  });

  connection.on('error', function(err) {
    console.log('error');
    console.log(err);
  });

  connection.on('close', function() {
    console.log('closed');
  });
}
