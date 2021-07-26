/**
 * API Instances index module
 *
 * @packageDocumentation
 */

import urn_core from 'uranio-core';

type ApiInstance<T> = T | undefined;

let api_bll_request:ApiInstance<urn_core.bll.BLL<'request'>>;
let api_bll_error:ApiInstance<urn_core.bll.BLL<'error'>>;

export function get_bll_request():urn_core.bll.BLL<'request'>{
	if(!api_bll_request){
		api_bll_request = urn_core.bll.basic.create('request');
	}
	return api_bll_request;
}

export function get_bll_error():urn_core.bll.BLL<'error'>{
	if(!api_bll_error){
		api_bll_error = urn_core.bll.basic.create('error');
	}
	return api_bll_error;
}
