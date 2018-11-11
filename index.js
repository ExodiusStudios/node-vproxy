const {createServer, Server} = require('./lib/index');
const {HTTPRecord, HTTPSRecord} = require('./lib/records');

module.exports = {
	createServer,
	Server,
	HTTPRecord,
	HTTPSRecord
};