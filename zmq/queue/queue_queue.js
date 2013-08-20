var zmq = require('zmq'),
    push = zmq.socket('push'),
    pull = zmq.socket('pull'),
    queue = [];

push.bindSync('tcp://127.0.0.1:5000');
pull.bindSync('tcp://127.0.0.1:6000');

console.log('queue ready');

pull.on('message', function (msg) {
	queue.push(msg);
	queue.forEach(function (message) {
		push.send(message);
	});
	queue = [];
});
