var redis = require('redis'),
  config = require('config');

var client = redis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});

function start(config) {
  console.log("producer start");
  
  var connection = redis.createClient();
    messages = config.iterations,
    delay = config.producer_delay;

  // Wait for connection to become established.
  connection.on('ready', function () {
    console.log('producer ready');

    var bufferMsg = new Buffer(config.message_size);
    bufferMsg.fill("q");

    function sendMessage() {
      connection.rpush('my-queue', bufferMsg.toString());
    }

    if (delay !== 0) {
      var count = 0;
      var id = setInterval(function() {
        sendMessage();
        ++count;
        console.log(count);
        if (count === messages) {
          clearInterval(id);
          connection.quit();
        }
      }, delay);
    }
    else {
      var count = 0;
      for (var i = 0; i < messages; ++i)
        sendMessage();
      connection.quit();
    }
  });

  connection.on('error', function(err) {
    //console.log('error');
    //console.log(err);
  });

  connection.on('end', function() {
    console.log('producer closed');
    process.exit();
  });
}

start(config.test_cases[process.env.test_index]);
