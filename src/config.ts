import connect = require("connect");
import httpProxy from 'http-proxy';
import { ProxyConfig } from "./proxyConfig";

export interface Config {
	
	/** Configuration details for the proxy */
	proxy?: ProxyConfig;

	/** Specify whether you want to use HTTPS or not. Defaults to false */
	https?: boolean;

	/** Inject additional middleware into the connect stack */
	onBuild?: (stack: connect.Server) => void;

	/** Inject additional logic into the proxy */
	onProxy?: (proxy: httpProxy) => void;
}

// TODO: Test
// FIXME: BUG
// SECTION: Testing
// FIXME: This should appear
// SECTION: Testing
// FIXME: This should appear
// SECTION: Testing
// FIXME: This should appear
// !SECTION: Boo
// !SECTION: Boo
// !SECTION: Boo
// FIXME: Test