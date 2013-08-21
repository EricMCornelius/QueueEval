var zmq = require('zmq'),
  strategies = require(process.cwd() + '/strategies/producer_strategies'),
  connection = zmq.socket('push');

function start(config) {
  connection.connect('tcp://127.0.0.1:6000');
  console.log("producer start");
  
  var messages = config.messages / config.producers;

  var bufferMsg = new Buffer(config.message_size);
  bufferMsg.fill("q");

  var strategy = strategies[config.production_strategy];

  function sendMessage() {
    strategy(function() {
      connection.send(bufferMsg.toString());
      process.send({count:1});
    });
  }

  function closeConnection() {
    connection.close();
  }

  var count = 0;
  for (var i = 0; i < messages; ++i)
    sendMessage();
  closeConnection();
}

var config = JSON.parse(process.env.test);
start(config);
