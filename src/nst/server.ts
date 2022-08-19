/**
 * API Instances index module
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

type ApiInstance<T> = T | undefined;

let api_bll_request:ApiInstance<core.bll.BLL<'_request'>>;
let api_bll_error:ApiInstance<core.bll.BLL<'_error'>>;

export function get_bll_request():core.bll.BLL<'_request'>{
	if(!api_bll_request){
		api_bll_request = core.bll.basic.create('_request');
	}
	return api_bll_request;
}

export function get_bll_error():core.bll.BLL<'_error'>{
	if(!api_bll_error){
		api_bll_error = core.bll.basic.create('_error');
	}
	return api_bll_error;
}
