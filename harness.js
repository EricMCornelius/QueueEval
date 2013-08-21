var child_process = require('child_process'),
  async = require('async'),
  _ = require('underscore');

// http://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
function cartesianProduct() {
  return _.reduce(arguments, function(a, b) {
    return _.flatten(_.map(a, function(x) {
      return _.map(b, function(y) {
        return x.concat([y]);
      });
    }), true);
  }, [ [] ]);
};

var message_sizes = [32, 256, 1024];
var consumer_delays = [0, 1000];
var num_messages = [50000];
var num_producers = [1, 4];
var num_consumers = [1, 4];
var queue_types = ['redis'];
var production_strategies = ['passthrough'];
var consumption_strategies = ['passthrough'];

var test_cases = cartesianProduct(message_sizes, consumer_delays, num_messages, num_consumers, num_producers, queue_types, production_strategies, consumption_strategies);
test_cases = test_cases.map(function(attributes) {
  return {
    message_size: attributes[0],
    consumer_delay: attributes[1],
    messages: attributes[2],
    consumers: attributes[3],
    producers: attributes[4],
    queue_type: attributes[5],
    production_strategy: attributes[6],
    consumption_strategy: attributes[7]
  }
});

async.forEachSeries(test_cases, function(test, cb) {
  console.log(test);
  process.env.test = JSON.stringify(test);

  before_each(test, function() {
    var finished = 0;

    function start_proc(script) {
      var start = new Date();
      var proc = child_process.spawn('node', [script], {stdio: 'inherit'});

      proc.on('exit', function() {
        ++finished;
        console.log(script, 'time:', new Date() - start);
        if (finished === 2)
          cb();
      });
    }

    start_proc('harness_producer');
    setTimeout(async.apply(start_proc, 'harness_consumer'), test.consumer_delay);
  });
});

var zmq_queue;

function before_each(test, cb) {
  if (test.queue_type === 'redis') {
    var redis = require('redis');
    var client = redis.createClient();
    client.del('my-queue');
    client.quit();
  }
  if (test.queue_type === 'zmq') {
    if (!_.isUndefined(zmq_queue)) {
      zmq_queue.kill();
    }
    zmq_queue = child_process.spawn('node', ['zmq/queue/queue_queue.js']);
  }
  cb();
}
