var zmq = require('zmq'),
  connection = zmq.socket('push');

function start(config) {
  connection.connect('tcp://127.0.0.1:6000');
  console.log("producer start");
  
  var messages = config.iterations,
    delay = config.producer_delay;

  var bufferMsg = new Buffer(config.message_size);
  bufferMsg.fill("q");

  function sendMessage() {
    connection.send(bufferMsg.toString());
    process.send({count:1});
  }

  function closeConnection() {
    connection.close();
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

var config = JSON.parse(process.env.test);
start(config);
