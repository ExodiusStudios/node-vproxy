import { HTTPRecord, HTTPSRecord } from './records';
import { Config } from './config';
import { ListenConfig } from './listenConfig';
declare type ConnectionRecord = HTTPRecord | HTTPSRecord;
/**
 * A sceptre proxy server that allows incoming connections to be
 * proxied to various endpoints, based on the hostname used to
 * connect.
 */
export declare class Server {
    /** The proxy used to forward requests */
    private proxy;
    /** The HTTP and HTTPS server used to listen to requests */
    private http;
    private https?;
    private records;
    private stack;
    private onBuild?;
    /**
     * Initialize a new Server instance.
     *
     * @param records Array of HTTP or HTTPS records
     * @param config Server configuration
     */
    constructor(records: ConnectionRecord[], config: Config);
    /**
     * Listen on the specified ports for incoming connections.
     *
     * @param config Listen config
     * @param callback Optional callback to run
     * @returns Callback promise
     */
    listen(config: ListenConfig, callback?: Function): Promise<[void, void]>;
    /**
     * Close the VirtualRouter instance and the underlying proxy server
     *
     * @param callback Optional callback to run
     * @returns Callback promise
     */
    close(callback?: Function): Promise<[void, void, void]>;
    /**
     * Update the internal list of routing records. This will alter the behavior
     * of the proxy immediately.
     *
     * @param records New routing records
     */
    setRecords(records: ConnectionRecord[]): void;
    /**
     * Append a new HTTP or HTTPS record onto the stack
     *
     * @param record The record to append
     */
    addRecord(record: ConnectionRecord): void;
    /**
     * Remove a HTTP or HTTPS record from the stack
     *
     * @param record The record to remove
     */
    removeRecord(record: ConnectionRecord): boolean;
}
/**
 * Create a new sceptre server instance
 *
 * @param config The configuration instance used to
 * configure the http server, proxy, or vproxy
 */
export declare function createServer(records: ConnectionRecord | ConnectionRecord[], config?: Config): Server;
export { HTTPRecord, HTTPSRecord };
