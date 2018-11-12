/// <reference types="node" />
import { ProxyConfig } from "./proxyConfig";
import url from "url";
import { Credentials, CredentialDetails } from 'crypto';
declare type ProxyTargetUrl = string | url.Url;
declare type ProxyMatch = string | RegExp;
/**
 * A record representing a HTTPS endpoint
 */
export declare class HTTPSRecord {
    /** URL string to be parsed with the url module. */
    target?: ProxyTargetUrl;
    /** Configuration details for the proxy */
    proxy?: ProxyConfig;
    /** Optional request handler */
    onRequest?: Function;
    /** The hostname to match. Either a string or RegExp may be supplied */
    match: RegExp;
    /** Certificate credentials used for HTTPS verification */
    credentials: Credentials;
    /**
     * Create a new HTTP record definition
     *
     * @param match The hostname pattern to match
     * @param target The proxy target
     * @param cert The HTTPS certificate
     * @param proxy Optional proxy config
     */
    constructor(match: ProxyMatch, target: ProxyTargetUrl, cert: CredentialDetails, proxy?: ProxyConfig, onRequest?: Function);
}
/**
 * A record representing a HTTP endpoint
 */
export declare class HTTPRecord {
    /** URL string to be parsed with the url module. */
    target?: ProxyTargetUrl;
    /** Configuration details for the proxy */
    proxy?: ProxyConfig;
    /** Optional request handler */
    onRequest?: Function;
    /** The hostname to match. Either a string or RegExp may be supplied */
    match: RegExp;
    /**
     * Create a new HTTP record definition
     *
     * @param match The hostname pattern to match
     * @param target The proxy target
     * @param proxy Optional proxy config
     */
    constructor(match: ProxyMatch, target: ProxyTargetUrl, proxy?: ProxyConfig, onRequest?: Function);
}
export {};
