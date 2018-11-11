declare module "vhost" {
	export function vhost(hostname: string|RegExp, handler: Function): any;
	export function hostregexp(hostname: string|RegExp): RegExp;
	export {};
}