var amqp = require('amqp'),
  config = require('config');

function start(config){
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

console.log(process.env.test);
start(config.test_cases[process.env.test]);

