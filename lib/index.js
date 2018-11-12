"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var https_1 = __importDefault(require("https"));
var http_proxy_1 = __importDefault(require("http-proxy"));
var records_1 = require("./records");
exports.HTTPRecord = records_1.HTTPRecord;
exports.HTTPSRecord = records_1.HTTPSRecord;
var connect_1 = __importDefault(require("connect"));
var vhost_1 = require("./vhost");
/**
 * A sceptre proxy server that allows incoming connections to be
 * proxied to various endpoints, based on the hostname used to
 * connect.
 */
var Server = /** @class */ (function () {
    /**
     * Initialize a new Server instance.
     *
     * @param records Array of HTTP or HTTPS records
     * @param config Server configuration
     */
    function Server(records, config) {
        var _this = this;
        this.onBuild = config.onBuild;
        this.proxy = http_proxy_1.default.createProxyServer(config && config.proxy);
        this.stack = buildMiddleware(records || [], this.proxy, this.onBuild);
        this.records = records;
        // Call proxy handler
        if (config.onProxy) {
            config.onProxy(this.proxy);
        }
        // Manually hand off the request to the middleware stack
        var handler = function (req, res) { return _this.stack(req, res); };
        // Create the HTTP and HTTPS server
        this.http = http_1.default.createServer(handler);
        if (config.https) {
            this.https = https_1.default.createServer({
                SNICallback: function (hostname) { return resolveCertificate(_this.records, hostname); }
            }, handler);
        }
    }
    /**
     * Listen on the specified ports for incoming connections.
     *
     * @param config Listen config
     * @param callback Optional callback to run
     * @returns Callback promise
     */
    Server.prototype.listen = function (config, callback) {
        var _this = this;
        var port = 80;
        var sslPort = 443;
        if (typeof config === 'number') {
            port = config;
        }
        else {
            var con = config;
            port = con.port;
            if (con.sslPort)
                sslPort = con.sslPort;
        }
        var http = new Promise(function (s) { return _this.http.listen(port || 80, function () { return s(); }); });
        var http2 = this.https ? new Promise(function (s) { return _this.https.listen(sslPort || 80, function () { return s(); }); }) : Promise.resolve();
        if (callback)
            callback();
        return Promise.all([http, http2]);
    };
    /**
     * Close the VirtualRouter instance and the underlying proxy server
     *
     * @param callback Optional callback to run
     * @returns Callback promise
     */
    Server.prototype.close = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var http, http2, http3;
            var _this = this;
            return __generator(this, function (_a) {
                http = new Promise(function (s) { return _this.http.close(function () { return s(); }); });
                http2 = new Promise(function (s) { return _this.proxy.close(function () { return s(); }); });
                http3 = this.https ? new Promise(function (s) { return _this.https.close(function () { return s(); }); }) : Promise.resolve();
                if (callback)
                    callback();
                return [2 /*return*/, Promise.all([http, http2, http3])];
            });
        });
    };
    /**
     * Update the internal list of routing records. This will alter the behavior
     * of the proxy immediately.
     *
     * @param records New routing records
     */
    Server.prototype.setRecords = function (records) {
        this.stack = buildMiddleware(records, this.proxy, this.onBuild);
    };
    /**
     * Append a new HTTP or HTTPS record onto the stack
     *
     * @param record The record to append
     */
    Server.prototype.addRecord = function (record) {
        this.records.push(record);
        this.stack = buildMiddleware(this.records, this.proxy, this.onBuild);
    };
    /**
     * Remove a HTTP or HTTPS record from the stack
     *
     * @param record The record to remove
     */
    Server.prototype.removeRecord = function (record) {
        var idx = this.records.indexOf(record);
        if (idx < 0)
            return false;
        this.records.splice(idx, 1);
        this.stack = buildMiddleware(this.records, this.proxy, this.onBuild);
        return true;
    };
    return Server;
}());
exports.Server = Server;
/**
 * Create a new sceptre server instance
 *
 * @param config The configuration instance used to
 * configure the http server, proxy, or vproxy
 */
function createServer(records, config) {
    if (Array.isArray(records)) {
        return new Server(records, config || {});
    }
    else {
        return new Server([records], config || {});
    }
}
exports.createServer = createServer;
/**
 * Build a middleware stack with the given record array
 *
 * @private
 * @param records Routing records to setup
 */
function buildMiddleware(records, proxy, onBuild) {
    var app = connect_1.default();
    // Call the onBuild hook
    if (onBuild)
        onBuild(app);
    // Append vhost proxies
    records.forEach(function (record) {
        app.use(vhost_1.vhost(record.match, function (req, res) {
            if (record.onRequest)
                record.onRequest(req, res);
            proxy.web(req, res, __assign({}, record.proxy, { target: record.target }));
        }));
    });
    return app;
}
/**
 * Resolve the credentials for the given hostname. Used by the SNI Callback.
 *
 * @private
 * @param hostname Requested hostname
 */
function resolveCertificate(records, hostname) {
    var ret;
    records.forEach(function (record) {
        if (!(record instanceof records_1.HTTPSRecord))
            return;
        if (record.match.test(hostname)) {
            ret = record.credentials;
            return false;
        }
    });
    return ret;
}
