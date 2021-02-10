/**
 * Logger module
 *
 * @packageDocumentation
 */

import urn_core from 'urn_core';

import {Atom} from '../types';

export async function debug(msg:string, path?:string, ip?:string, params?:string, query?:string, body?:string)
		:Promise<Atom<'log'> | undefined>{
	return urn_core.logger.debug(msg, {path: path, ip:ip, params:params, query:query, body:body});
}

export async function error(msg:string, path?:string, ip?:string, params?:string, query?:string, body?:string)
		:Promise<Atom<'log'> | undefined>{
	return urn_core.logger.error(msg, {path: path, ip:ip, params:params, query:query, body:body});
}
