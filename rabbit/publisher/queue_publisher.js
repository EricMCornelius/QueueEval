var amqp = require('amqp');

var connection = amqp.createConnection({ host: 'localhost' });

var messages = 1000;
var delay = 50;

// Wait for connection to become established.
connection.on('ready', function () {
  console.log('ready');

  function sendMessage() {
    connection.queue('my-queue', function(q){
      connection.publish('my-queue', { msg: 'test' });
    });
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

connection.on('error', function(err) {
  console.log('error');
  console.log(err);
});

connection.on('close', function() {
  console.log('close');
});
