/*!
 * vhost
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/**
 * Create a vhost middleware.
 *
 * @param {string|RegExp} hostname
 * @param {function} handle
 * @return {Function}
 * @public
 */
export declare function vhost(hostname: any, handle: any): (req: any, res: any, next: any) => any;
/**
 * Generate RegExp for given hostname value.
 *
 * @param (string|RegExp} val
 * @private
 */
export declare function hostregexp(val: any): RegExp;
