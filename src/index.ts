import http, { IncomingMessage, ServerResponse } from 'http';
import https from 'https';
import httpProxy from 'http-proxy';
import { HTTPRecord, HTTPSRecord } from './records';
import connect from 'connect';
import { vhost } from './vhost';
import { Config } from './config';
import { ListenConfig } from './listenConfig';
import { promisify } from 'util';
import { Credentials } from 'crypto';

type ConnectionRecord = HTTPRecord|HTTPSRecord;

/**
 * A sceptre proxy server that allows incoming connections to be
 * proxied to various endpoints, based on the hostname used to
 * connect.
 */
export class Server {

	/** The proxy used to forward requests */
	private proxy: httpProxy;

	/** The HTTP and HTTPS server used to listen to requests */
	private http: http.Server
	private https?: https.Server

	/* The record list & Connect middleware stack */
	private records: ConnectionRecord[];
	private stack: connect.Server;

	/* Optional callback handlers */
	private onBuild?: (stack: connect.Server) => void;

	/**
	 * Initialize a new Server instance.
	 * 
	 * @param records Array of HTTP or HTTPS records
	 * @param config Server configuration
	 */
	constructor(records: ConnectionRecord[], config: Config) {
		this.onBuild = config.onBuild;
		this.proxy = httpProxy.createProxyServer(config && config.proxy);
		this.stack = buildMiddleware(records || [], this.proxy, this.onBuild);
		this.records = records;

		// Call proxy handler
		if(config.onProxy) {
			config.onProxy(this.proxy);
		}

		// Manually hand off the request to the middleware stack
		const handler = (req: IncomingMessage, res: ServerResponse) => this.stack(req, res);

		// Create the HTTP and HTTPS server
		this.http = http.createServer(handler);
		
		if(config.https) {
			this.https = https.createServer({
				SNICallback: (hostname) => resolveCertificate(this.records, hostname)
			}, handler);
		}
	}

	/**
	 * Listen on the specified ports for incoming connections.
	 * 
	 * @param config Listen config
	 * @param callback Optional callback to run
	 * @returns Callback promise
	 */
	public listen(config: ListenConfig|number, callback?: Function) : Promise<[void, void]> {
		let port = 80;
		let sslPort = 443;
		
		if(typeof config === 'number') {
			port = config;
		} else {
			const con = config as ListenConfig;
			port = con.port;
			if(con.sslPort) sslPort = con.sslPort;
		}

		const http: Promise<void> = new Promise<void>(s => this.http.listen(port || 80, () => s()));
		const http2: Promise<void> = this.https ? new Promise<void>(s => this.https!.listen(sslPort || 80, () => s())) : Promise.resolve();

		if(callback) callback();
		return Promise.all([http, http2])
	}

	/**
	 * Close the VirtualRouter instance and the underlying proxy server
	 * 
	 * @param callback Optional callback to run
	 * @returns Callback promise
	 */
	public async close(callback?: Function) : Promise<[void, void, void]> {
		const http: Promise<void> = new Promise<void>(s => this.http.close(() => s()));
		const http2: Promise<void> = new Promise<void>(s => this.proxy.close(() => s()));
		const http3: Promise<void> = this.https ? new Promise<void>(s => this.https!.close(() => s())) : Promise.resolve();

		if(callback) callback();
		return Promise.all([http, http2, http3])
	}

	/**
	 * Update the internal list of routing records. This will alter the behavior
	 * of the proxy immediately.
	 * 
	 * @param records New routing records
	 */
	public setRecords(records: ConnectionRecord[]) {
		this.stack = buildMiddleware(records, this.proxy, this.onBuild);
	}

	/**
	 * Append a new HTTP or HTTPS record onto the stack
	 * 
	 * @param record The record to append
	 */
	public addRecord(record: ConnectionRecord) {
		this.records.push(record);
		this.stack = buildMiddleware(this.records, this.proxy, this.onBuild);
	}

	/**
	 * Remove a HTTP or HTTPS record from the stack
	 * 
	 * @param record The record to remove
	 */
	public removeRecord(record: ConnectionRecord) : boolean {
		let idx = this.records.indexOf(record);
		if(idx < 0) return false;
		this.records.splice(idx, 1);
		this.stack = buildMiddleware(this.records, this.proxy, this.onBuild);
		return true;
	}

}

/**
 * Create a new sceptre server instance
 * 
 * @param config The configuration instance used to
 * configure the http server, proxy, or vproxy
 */
export function createServer(records: ConnectionRecord|ConnectionRecord[], config?: Config) : Server {
	if(Array.isArray(records)) {
		return new Server(records, config || {});
	} else {
		return new Server([records], config || {});
	}
}

export {HTTPRecord, HTTPSRecord};

/**
 * Build a middleware stack with the given record array
 * 
 * @private
 * @param records Routing records to setup
 */
function buildMiddleware(records: ConnectionRecord[], proxy: httpProxy, onBuild?: Function) : connect.Server {
	const app = connect();

	// Call the onBuild hook
	if(onBuild) onBuild(app);

	// Append vhost proxies
	records.forEach(record => {
		app.use(vhost(record.match, (req: IncomingMessage, res: ServerResponse) => {
			if(record.onRequest) record.onRequest(req, res);
			
			proxy.web(req, res, {
				...record.proxy,
				target: record.target
			});
		}));
	});

	return app;
}

/**
 * Resolve the credentials for the given hostname. Used by the SNI Callback.
 * 
 * @private
 * @param hostname Requested hostname
 */
function resolveCertificate(records: ConnectionRecord[], hostname: string) : Credentials|undefined {
	let ret;

	records.forEach(record => {
		if(!(record instanceof HTTPSRecord)) return;
		
		if(record.match.test(hostname)) {
			ret = record.credentials;
			return false;
		}
	});

	return ret;
}