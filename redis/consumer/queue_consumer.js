var redis = require('redis'),
  config = require('config');

function start(config){
  console.log("consumer start");
  var connection = redis.createClient();

  // Wait for connection to become established.
  connection.on('ready', function () {
    console.log('consumer ready');

    var count = 0;
    function receive() {
      connection.blpop('my-queue', 0, function(err, message) {
        ++count;
        if (count % 100 === 0)
          console.log(count);
        receive();
      });
    }
    receive();
  });

  connection.on('error', function(err) {
    console.log('error');
    console.log(err);
  });

  connection.on('end', function() {
    console.log('consumer closed');
  });
}

start(config.test_cases[process.env.test_index]);
