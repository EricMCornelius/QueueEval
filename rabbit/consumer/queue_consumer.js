var amqp = require('amqp'),
  config = require('config');

module.exports.start = function(config){

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

var testId = process.env.test;
console.log("consumer");
console.log(testId);
start(config.test_cases[testId]);
