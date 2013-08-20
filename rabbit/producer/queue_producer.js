var amqp = require('amqp'),
  config = require('config'),
  async = require('async');

function end_connection(conn) {
  console.log('closing producer');
  conn.queue('tmp-' + Math.random(), function() {
    conn.end();
    
    conn.once('error', function(e) {
      if (e.code !== 'ECONNRESET' || e.syscall !== 'read')
        throw e;
      process.exit(0);
    });
  });
}

function start(config){
  console.log("producer start");
  var connection = amqp.createConnection({ host: 'localhost' }),
    messages = config.iterations,
    delay = config.producer_delay;

  // Wait for connection to become established.
  connection.on('ready', function () {
    console.log('producer ready');

    connection.queue('my-queue', function(q){
      var bufferMsg = new Buffer(config.message_size);
      bufferMsg.fill("q");

      function sendMessage() {
        connection.exchange().publish('my-queue', { msg: bufferMsg.toString() });
      };

      if (delay !== 0) {
        var count = 0;
        var id = setInterval(function() {
          sendMessage();
          ++count;
          console.log(count);
          if (count === messages) {
            end_connection(connection);
            clearInterval(id);
          }
        }, delay);
      }
      else {
        var count = 0;
        for (var i = 0; i < messages; ++i)
          sendMessage();
        end_connection(connection);
      }

    });
  });

  connection.on('error', function(err) {
    //console.log('error');
    //console.log(err);
  });

  connection.on('close', function() {
    console.log('producer closed');
  });
}

start(config.test_cases[process.env.test_index]);
