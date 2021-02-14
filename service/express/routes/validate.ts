/**
 * Validate Route request module
 *
 * @packageDocumentation
 */

import {urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init(`VALIDATE_REQUEST`, `Validate request module`);

import urn_core from 'urn_core';

import {AtomName, Query, TokenObject} from '../../../types';

import {ExpressQueryParam} from '../types';


export async function process_request_token(locals:unknown)
		:Promise<TokenObject>{
	if(!locals || !(locals as any).urn){
		throw urn_exc.create('INVALID_REQUEST_LOCALS', 'Invalid request locals not set.');
	}
	const urn_locals = (locals as any).urn;
	
	await urn_core.bll.auth.is_valid_token_object(urn_locals.token_object);
	
	const token_object:TokenObject = urn_locals.token_object;
	
	return token_object;
}

export function process_request_filter<A extends AtomName>(filter:ExpressQueryParam)
		:Query<A>{
	if(typeof filter === 'undefined'){
		return {};
	}
	if(!Array.isArray(filter) && typeof filter === 'object'){
		return filter;
	}
	throw urn_exc.create_invalid_request(`INVALID_FILTER`, `Invalid filter`);
}

export function process_request_options<A extends AtomName>(options:ExpressQueryParam)
		:Query.Options<A>{
	if(typeof options === 'undefined'){
		return {};
	}
	if(!Array.isArray(options) && typeof options === 'object'){
		return options;
	}
	throw urn_exc.create_invalid_request(`INVALID_OPTIONS`, `Invalid options`);
}

export function only_valid_query_keys(query:unknown, valid_query_keys:string[])
		:void{
	if(query && typeof query === 'object'){
		for(const [k] of Object.entries(query)){
			if(!valid_query_keys.includes(k)){
				const err_msg = `Invalid request query parameters [${k}]`;
				throw urn_exc.create_invalid_request(`INVALID_QUERY`, err_msg);
			}
		}
	}
}

export function only_valid_param_keys(params:unknown, valid_params_keys:string[])
		:void{
	if(params && typeof params === 'object'){
		for(const [k] of Object.entries(params)){
			if(!valid_params_keys.includes(k)){
				const err_msg = `Invalid parameters [${k}]`;
				throw urn_exc.create_invalid_request(`INVALID_PARAMETERS`, err_msg);
			}
		}
	}
}

export function empty(p:unknown, param_name:string)
		:true{
	if(!p){
		return true;
	}
	if(p && typeof p === 'object' && Object.keys(p).length === 0){
		return true;
	}
	let err_msg = `Invalid request.`;
	err_msg += ` [${param_name}]`;
	err_msg += ` should be empty.`;
	throw urn_exc.create_invalid_request(`INVALID_PARAM`, err_msg);
}
