import { RoutingRecord } from "./routingRecord";
import connect = require("connect");
import { ProxyConfig } from "./proxyConfig";
export interface Config {
    /** Configuration details for the proxy */
    proxy?: ProxyConfig;
    /** A list of routing records used to control the proxy behavior */
    routes: RoutingRecord[];
    /** Inject additional middleware into the connect stack */
    onBuild?: (stack: connect.Server) => void;
}
