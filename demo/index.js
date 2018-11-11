const {createServer, HTTPRecord, HTTPSRecord} = require('../index');
const http = require('http');

const records = [
	new HTTPRecord('two.localhost', 'localhost:8000'),
	new HTTPRecord('*.localhost', 'localhost:8001'),
	new HTTPRecord('localhost', 'localhost:8002'),
]

const server = createServer(records);

server.listen({port: 80});