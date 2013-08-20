var amqp = require('amqp'),
  cluster = require('cluster');

module.exports.start = function(config){

  if (cluster.isMaster) {
    for (var i = 0; i < config.producers-1; i++) {
      cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
      console.log('worker ' + worker.process.pid + ' died');
    });
  }

  console.log("producer start");
  var connection = amqp.createConnection({ host: 'localhost' }),
    messages = config.iterations,
    delay = config.producer_delay;

  // Wait for connection to become established.
  connection.on('ready', function () {
    console.log('producer ready');

    connection.queue('my-queue', function(q){

      function sendMessage() {
        var bufferMsg = new Buffer(config.message_size);
        bufferMsg.fill("q");
        connection.publish('my-queue', { msg: bufferMsg.toString() });
      };

      if (delay !== 0) {
        setInterval(function() {
          sendMessage();
        }, delay);
      }
      else {
        for (var x = 0; x < messages; ++x)
          sendMessage();
      }

    });
  });

  connection.on('error', function(err) {
    console.log('error');
    console.log(err);
  });

  connection.on('close', function() {
    console.log('close');
  });
}
