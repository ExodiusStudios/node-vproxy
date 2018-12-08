"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var vhost_1 = require("./vhost");
/**
 * A record representing a HTTPS endpoint
 */
var HTTPSRecord = /** @class */ (function () {
    /**
     * Create a new HTTP record definition
     *
     * @param match The hostname pattern to match
     * @param target The proxy target
     * @param cert The HTTPS certificate
     * @param proxy Optional proxy config
     */
    function HTTPSRecord(match, target, cert, proxy, onRequest) {
        this.match = vhost_1.hostregexp(match);
        this.target = target;
        this.proxy = proxy;
        this.onRequest = onRequest;
        this.credentials = crypto_1.createCredentials(cert);
    }
    return HTTPSRecord;
}());
exports.HTTPSRecord = HTTPSRecord;
/**
 * A record representing a HTTP endpoint
 */
var HTTPRecord = /** @class */ (function () {
    /**
     * Create a new HTTP record definition
     *
     * @param match The hostname pattern to match
     * @param target The proxy target
     * @param proxy Optional proxy config
     */
    function HTTPRecord(match, target, proxy, onRequest) {
        this.match = vhost_1.hostregexp(match);
        this.target = target;
        this.proxy = proxy;
        this.onRequest = onRequest;
    }
    return HTTPRecord;
}());
exports.HTTPRecord = HTTPRecord;
