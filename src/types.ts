/**
 * Types module
 *
 * @packageDocumentation
 */

export type Configuration = {
	
	ws_port: number;
	
}

export interface Service {
	
	listen(ws_port:number, callback:() => void):void;
	
}
