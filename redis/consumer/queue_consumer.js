var redis = require('redis'),
  strategies = require(process.cwd() + '/strategies/consumer_strategies');

function start(config) {
  var strategy = strategies[config.consumption_strategy];
  var connection = redis.createClient();

  console.log("consumer start");

  // Wait for connection to become established.
  connection.on('ready', function () {
    console.log('consumer ready');

    function receiveMessage() {
      connection.blpop('my-queue', 1, function(err, message) {
        strategy(function() {
          process.send({count: 1});
          receiveMessage();
        });
      });
    }
    receiveMessage();
  });
}

var config = JSON.parse(process.env.test);
start(config);
