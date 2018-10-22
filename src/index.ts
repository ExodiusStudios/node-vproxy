import http, { IncomingMessage, ServerResponse } from 'http';
import https from 'http';
import httpProxy from 'http-proxy';
import { RoutingRecord } from './routingRecord';
import connect from 'connect';
import vhost from 'vhost';
import { Config } from './config';
import { ListenConfig } from './listenConfig';
import { promisify } from 'util';

/**
 * A sceptre proxy server that allows incoming connections to be
 * proxied to various endpoints, based on the hostname used to
 * connect.
 */
class Server {

	/** The proxy used to forward requests */
	private proxy: httpProxy;

	/** The HTTP and HTTPS server used to listen to requests */
	private http: http.Server
	private https: https.Server

	/** The Connect middleware stack */
	private stack: connect.Server;

	/** Optional callback handlers */
	private onBuild?: (stack: connect.Server) => void;

	/**
	 * Initialize a new Server instance.
	 * 
	 * @param config Server configuration
	 */
	constructor(config: Config) {
		this.proxy = httpProxy.createProxyServer(config.proxy);
		this.stack = this.buildMiddleware(config.routes || []);

		// Manually hand off the request to the middleware stack
		const handler = (req: IncomingMessage, res: ServerResponse) => this.stack(req, res);

		// Create the HTTP and HTTPS server
		this.http = http.createServer(handler);
		this.https = https.createServer(handler);
	}

	/**
	 * Listen on the specified ports for incoming connections.
	 * 
	 * @param config Listen config
	 * @param callback Optional callback to run
	 * @returns Callback promise
	 */
	public async listen(config: ListenConfig, callback?: Function) : Promise<void> {
		await Promise.all([
			promisify(this.http.listen)(config.port || 80),
			promisify(this.https.listen)(config.sslPort || 443)
		]);

		if(callback) callback();
	}

	/**
	 * Close the VirtualRouter instance and the underlying proxy server
	 * 
	 * @param callback Optional callback to run
	 * @returns Callback promise
	 */
	public async close(callback?: Function) : Promise<void> {
		await Promise.all([
			promisify(this.http.close)(),
			promisify(this.https.close)(),
			promisify(this.proxy.close)(undefined)
		]);

		if(callback) callback();
	}

	/**
	 * Update the internal list of routing records. This will alter the behavior
	 * of the proxy immediately.
	 * 
	 * @param records New routing records
	 */
	public update(records: RoutingRecord[]) {
		this.stack = this.buildMiddleware(records);
	}

	/**
	 * Build a middleware stack with the given record array
	 * 
	 * @param records Routing records to setup
	 */
	private buildMiddleware(records: RoutingRecord[]) : connect.Server {
		const app = connect();

		if(this.onBuild) {
			this.onBuild(app);
		}

		records.forEach(record => {
			app.use(vhost(record.match, (req: IncomingMessage, res: ServerResponse) => {
				this.proxy.web(req, res, {
					...record.proxy,
					target: record.proxy
				});
			}));
		});

		return app;
	}

}

/**
 * Create a new sceptre server instance
 * 
 * @param config The configuration instance used to
 * configure the http server, proxy, or vproxy
 */
export function createServer(config: Config) : Server {
	return new Server(config);
}