var zmq = require('zmq'),
  strategies = require(process.cwd() + '/strategies/consumer_strategies'),
  connection = zmq.socket('pull');


function start(config){
  connection.connect('tcp://127.0.0.1:5000');
  console.log("consumer start");

  var strategy = strategies[config.consumption_strategy];
  
  connection.on('message', function(msg) {
    strategy(function() {
      process.send({count: 1});
    });
  });
}

var config = JSON.parse(process.env.test);
start(config);
