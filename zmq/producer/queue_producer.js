var zmq = require('zmq'),
  config = require('config'),
  connection = zmq.socket('push');


function start(config) {
  connection.connect('tcp://127.0.0.1:6000');
  console.log("producer start");
  
  var messages = config.iterations,
    delay = config.producer_delay;

  console.log('producer ready');

  var bufferMsg = new Buffer(config.message_size);
  bufferMsg.fill("q");

  function sendMessage() {
    connection.send(bufferMsg.toString());
  }

  function closeConnection() {
    connection.close();
    console.log('producer closed');
    process.exit();    
  }

  if (delay !== 0) {
    var count = 0;
    var id = setInterval(function() {
      sendMessage();
      ++count;
      console.log(count);
      if (count === messages) {
        clearInterval(id);
        closeConnection();
      }
    }, delay);
  }
  else {
    var count = 0;
    for (var i = 0; i < messages; ++i)
      sendMessage();
    closeConnection();
  }
}

start(config.test_cases[process.env.test_index]);
