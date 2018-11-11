const {createServer, HTTPRecord, HTTPSRecord} = require('../index');

const records = [
	new HTTPRecord('two.localhost', 'localhost:8000'),
	new HTTPRecord('*.localhost', 'localhost:8001'),
]

const server = createServer(records);

server.listen({port: 80});