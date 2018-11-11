import connect = require("connect");
import { ProxyConfig } from "./proxyConfig";

export interface Config {
	
	/** Configuration details for the proxy */
	proxy?: ProxyConfig;

	/** Specify whether you want to use HTTPS or not. Defaults to false */
	https?: boolean;

	/** Inject additional middleware into the connect stack */
	onBuild?: (stack: connect.Server) => void;
}
