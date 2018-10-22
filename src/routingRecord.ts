import { ProxyConfig } from "./proxyConfig";
import url from "url";

type ProxyTargetUrl = string | url.Url;
type RouteMatch = string|RegExp;

/**
 * A record representing a single routing endpoint in the virtual proxy
 */
export interface RoutingRecord {

	/** URL string to be parsed with the url module. */
    target?: ProxyTargetUrl;

	/** Configuration details for the proxy */
	proxy?: ProxyConfig;

	/** The hostname to match. Either a string or RegExp may be supplied */
	match: RouteMatch;

}