export interface ListenConfig {

	/**
	 * The port to run the HTTP proxy on. Defaults to 80
	 */
	port: number;

	/**
	 * The port to run the HTTPS proxy on. Defaults to 443
	 */
	sslPort?: number;

}