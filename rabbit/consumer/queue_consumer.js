var amqp = require('amqp');

var connection = amqp.createConnection({ host: 'localhost' });

// Wait for connection to become established.
connection.on('ready', function () {
  console.log('ready');

  // Use the default 'amq.topic' exchange
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
