var zmq = require('zmq'),
  connection = zmq.socket('pull');


function start(config){
  connection.connect('tcp://127.0.0.1:5000');
  console.log("consumer start");
  
  connection.on('message', function(msg) {
    process.send({count: 1});
  });
}

var config = JSON.parse(process.env.test);
start(config);
