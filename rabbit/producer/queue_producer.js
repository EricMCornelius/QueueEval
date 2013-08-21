var amqp = require('amqp'),
    strategies = require(process.cwd() + '/strategies/consumer_strategies');

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
  var strategy = strategies[config.production_strategy],
      connection = amqp.createConnection({ host: 'localhost' }),
      messages = config.messages / config.producers,
      delay = config.producer_delay;
  console.log("producer start");

  // Wait for connection to become established.
  connection.on('ready', function () {
    console.log('producer ready');

    connection.queue('my-queue', function(q){
      var bufferMsg = new Buffer(config.message_size);
      bufferMsg.fill("q");
      bufferMsg = bufferMsg.toString();

      function sendMessage() {
        connection.exchange().publish('my-queue', { msg: bufferMsg });
        process.send({count: 1});
      };

      for (var i = 0; i < messages; ++i)
        sendMessage();

      end_connection(connection);

    });
  });
}

var config = JSON.parse(process.env.test);
start(config);
