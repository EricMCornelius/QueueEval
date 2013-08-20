var zmq = require('zmq'),
  config = require('config'),
  connection = zmq.socket('pull');


function start(config){
  connection.connect('tcp://127.0.0.1:5000');
  console.log("consumer start");

  var count = 0;
  
  connection.on('message', function(msg) {
    ++count;
    if (count % 100 === 0)
      console.log(count);
  });
}

start(config.test_cases[process.env.test_index]);
