import { RoutingRecord } from './routingRecord';
import { Config } from './config';
import { ListenConfig } from './listenConfig';
/**
 * A sceptre proxy server that allows incoming connections to be
 * proxied to various endpoints, based on the hostname used to
 * connect.
 */
declare class Server {
    /** The proxy used to forward requests */
    private proxy;
    /** The HTTP and HTTPS server used to listen to requests */
    private http;
    private https;
    /** The Connect middleware stack */
    private stack;
    /** Optional callback handlers */
    private onBuild?;
    /**
     * Initialize a new Server instance.
     *
     * @param config Server configuration
     */
    constructor(config: Config);
    /**
     * Listen on the specified ports for incoming connections.
     *
     * @param config Listen config
     * @param callback Optional callback to run
     * @returns Callback promise
     */
    listen(config: ListenConfig, callback?: Function): Promise<void>;
    /**
     * Close the VirtualRouter instance and the underlying proxy server
     *
     * @param callback Optional callback to run
     * @returns Callback promise
     */
    close(callback?: Function): Promise<void>;
    /**
     * Update the internal list of routing records. This will alter the behavior
     * of the proxy immediately.
     *
     * @param records New routing records
     */
    update(records: RoutingRecord[]): void;
    /**
     * Build a middleware stack with the given record array
     *
     * @param records Routing records to setup
     */
    private buildMiddleware;
}
/**
 * Create a new VirtualRouter instance
 *
 * @param config The configuration instance used to
 * configure the http server, proxy, or vproxy
 */
export declare function createServer(config: Config): Server;
export {};
