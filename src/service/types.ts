/**
 * Service types module
 *
 * @packageDocumentation
 */

export interface Service {
	
	listen(callback?:() => void):void;
	listen(ws_port?:number, callback?:() => void):void;
	
}

export type ServiceName = 'express'; // | 'hapi' | 'nest_js'
