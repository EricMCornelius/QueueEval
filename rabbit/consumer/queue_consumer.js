var amqp = require('amqp'),
  strategies = require(process.cwd() + '/strategies/consumer_strategies');

function start(config){
  console.log("consumer start");
  var connection = amqp.createConnection({ host: 'localhost' });

  // Wait for connection to become established.
  connection.on('ready', function () {
    console.log('consumer ready');

    connection.queue('my-queue', function(q) {
      // Catch all messages
      q.bind('#');

      // Receive messages
      q.subscribe(function (message) {
        strategy(function() {
          process.send({count: 1});
        });
      });
    });
  });
}

var config = JSON.parse(process.env.test);
start(config);
