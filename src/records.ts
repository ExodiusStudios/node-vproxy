import { ProxyConfig } from "./proxyConfig";
import url from "url";
import crypto, {Credentials, CredentialDetails} from 'crypto';
import escape from 'escape-string-regexp';
import { hostregexp } from "vhost";

type ProxyTargetUrl = string|url.Url;
type ProxyMatch = string|RegExp;

/**
 * A record representing a HTTPS endpoint
 */
export class HTTPSRecord {

	/** URL string to be parsed with the url module. */
    public target?: ProxyTargetUrl;

	/** Configuration details for the proxy */
	public proxy?: ProxyConfig;

	/** Optional request handler */
	public onRequest?: Function;

	/** The hostname to match. Either a string or RegExp may be supplied */
	public match: RegExp;

	/** Certificate credentials used for HTTPS verification */
	public credentials: Credentials;

	/**
	 * Create a new HTTP record definition
	 * 
	 * @param match The hostname pattern to match
	 * @param target The proxy target
	 * @param cert The HTTPS certificate
	 * @param proxy Optional proxy config
	 */
	public constructor(match: ProxyMatch, target: ProxyTargetUrl, cert: CredentialDetails, proxy?: ProxyConfig, onRequest?: Function) {
		this.match = hostregexp(match);
		this.target = target;
		this.proxy = proxy;
		this.onRequest = onRequest;
		this.credentials = crypto.createCredentials(cert);
	}

}

/**
 * A record representing a HTTP endpoint
 */
export class HTTPRecord {

	/** URL string to be parsed with the url module. */
    public target?: ProxyTargetUrl;

	/** Configuration details for the proxy */
	public proxy?: ProxyConfig;

	/** Optional request handler */
	public onRequest?: Function;

	/** The hostname to match. Either a string or RegExp may be supplied */
	public match: RegExp;

	/**
	 * Create a new HTTP record definition
	 * 
	 * @param match The hostname pattern to match
	 * @param target The proxy target
	 * @param proxy Optional proxy config
	 */
	public constructor(match: ProxyMatch, target: ProxyTargetUrl, proxy?: ProxyConfig, onRequest?: Function) {
		this.match = hostregexp(match);
		this.target = target;
		this.proxy = proxy;
		this.onRequest = onRequest;
	}

}