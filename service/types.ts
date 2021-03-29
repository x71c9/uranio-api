/**
 * Service types module
 *
 * @packageDocumentation
 */

export interface Service {
	
	listen(ws_port:number, callback:() => void):void;
	
}

export type ServiceType = 'express'; // | 'hapi' | 'nest_js'
