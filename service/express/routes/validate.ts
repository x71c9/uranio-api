/**
 * Validate Route request module
 *
 * @packageDocumentation
 */

import {urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init(`VALIDATE_REQUEST`, `Validate request module`);

import {AtomName, Query} from '../../../types';

import {ExpressQueryParam} from '../types';


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
	let err_msg = `Invalid request ${param_name}`;
	err_msg += ` ${param_name[0].toUpperCase() + param_name.slice(1)}`;
	err_msg += ` should be empty.`;
	throw urn_exc.create_invalid_request(`INVALID_PARAM`, err_msg);
}
