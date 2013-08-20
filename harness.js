var config = require('config'),
  consumer = require('./rabbit/consumer/queue_consumer'),
  producer = require('./rabbit/producer/queue_producer');

config.test_cases.forEach( function(test){
  consumer.start(test);
  producer.start(test);
});
