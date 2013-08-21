var redis = require('redis'),
    strategies = require(process.cwd() + '/strategies/consumer_strategies');

function start(config) {
  var strategy = strategies[config.production_strategy],
      connection = redis.createClient(),
      messages = config.messages / config.producers,
      delay = config.producer_delay;
  console.log("producer start");

  // Wait for connection to become established.
  connection.on('ready', function () {
    console.log('producer ready');

    function sendMessage() {
      strategy(function() {
        connection.rpush('my-queue', bufferMsg);
        process.send({count:1});
      });
    }

    var bufferMsg = new Buffer(config.message_size);
    bufferMsg.fill("q");
    bufferMsg = bufferMsg.toString();

    for (var i = 0; i <= messages; ++i)
      sendMessage();

    connection.end();

  });
}

var config = JSON.parse(process.env.test);
start(config);
