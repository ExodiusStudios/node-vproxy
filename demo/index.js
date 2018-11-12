const {createServer, HTTPRecord, HTTPSRecord} = require('../index');
const http = require('http');

const server = createServer([
	new HTTPRecord("one.localhost", "http://localhost:8001"),
	new HTTPRecord("*.localhost", "http://localhost:8002"),
	new HTTPRecord("localhost", "http://localhost:8003")
], {
	onProxy: (proxy) => {

		// Send an error reply
		proxy.on('error', (err, req, res) => {
			res.writeHead(500, {
				'Content-Type': 'text/plain'
			});
		
			res.end('Something went wrong. And we are reporting a custom error message.');
		});
		
	}
});

server.listen(80).then(() => {
	console.log("Listening");
})

// Pick up one.localhost
http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('Connected to one localhost!');
	res.end();
}).listen(8001);

// Pick up any other localhost subdomain
// http.createServer(function (req, res) {
// 	res.writeHead(200, {'Content-Type': 'text/html'});
// 	res.write('Connected to wildcard localhost!');
// 	res.end();
// }).listen(8002); 

// Pick up localhost
http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('Connected to localhost!');
	res.end();
}).listen(8003); 