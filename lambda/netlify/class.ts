/**
 * Netlify class module
 *
 * @packageDocumentation
 */

// import {urn_log, urn_response, urn_exception} from 'urn-lib';
import {urn_log, urn_response} from 'urn-lib';

// const urn_exc = urn_exception.init('NETLIFYCLASS', 'Netlify class module');

import urn_core from 'uranio-core';

import {
	process_request_path,
	get_atom_name_from_atom_path,
	get_route_name,
	is_auth_request,
	get_params_from_route_path,
	get_auth_action,
	handle_and_store_exception,
	validate_request
} from '../../util/request';

import {route_middleware, auth_route_middleware} from '../../mdlw/';

import * as types from '../../types';

import {
	Lambda,
	LambdaEvent,
	LambdaContext,
	HandlerResponse,
	LambdaHeaders,
	LambdaMultiValueHeaders
} from '../types';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
class NetlifyLambda implements Lambda {
	
	public bll_requests:urn_core.bll.BLL<'request'>;
	public bll_errors:urn_core.bll.BLL<'error'>;
	
	constructor(){
		this.bll_requests = urn_core.bll.log.create('request');
		this.bll_errors = urn_core.bll.log.create('error');
	}
	
	public async handle(event:LambdaEvent, context:LambdaContext)
			:Promise<HandlerResponse> {
		const partial_api_request = _lambda_request_to_partial_api_request(event, context);
		try{
			const api_request = validate_request(partial_api_request);
			const urn_res = await this.lambda_route(api_request);
			return _lambda_response(urn_res);
		}catch(ex){
			const urn_err = await handle_and_store_exception(ex, partial_api_request, this.bll_errors);
			return _lambda_response(urn_err);
		}
	}
	
	public async lambda_route(api_request:types.ApiRequest){
		const log_blls = {
			req: this.bll_requests,
			err: this.bll_errors
		};
		if(api_request.is_auth){
			// ****
			// TODO CHECK - Maybe this can be a bad idea - to create the BLL on request
			// instead of passing only one reference. But it must be for each auth atom.
			// We do it anyway a bll for each call depending on the `path`.
			// ****
			const auth_bll = urn_core.bll.auth.create(api_request.atom_name as types.AuthName);
			const auth_handler = async (api_request:types.ApiRequest) => {
				const token = await auth_bll.authenticate(
					api_request.body.email,
					api_request.body.password
				);
				return token;
			};
			return auth_route_middleware(api_request, log_blls, auth_handler);
		}else{
			return route_middleware(api_request, log_blls);
		}
	}
	
}

// async function _lambda_handle_exception(
//   ex: urn_exception.ExceptionInstance,
//   partial_api_request: Partial<types.ApiRequest>,
//   bll_errs: urn_core.bll.BLL<'error'>
// ){
//   const atom_request = partial_api_request_to_atom_request(partial_api_request);
//   return await handle_and_store_exception(ex, atom_request, bll_errs);
// }

function _lambda_request_to_partial_api_request(event: LambdaEvent, context: LambdaContext){
	
	const api_request_paths = process_request_path(event.path);
	
	const api_request:Partial<types.ApiRequest> = {
		...api_request_paths,
		method: event.httpMethod,
		params: {},
		query: event.queryStringParameters || {},
	};
	
	const atom_name = get_atom_name_from_atom_path(api_request_paths.atom_path);
	if(!atom_name){
		return api_request;
	}
	
	api_request.atom_name = atom_name;
	
	const route_name = get_route_name(atom_name, api_request_paths.route_path, event.httpMethod);
	if(!route_name){
		return api_request;
	}
	
	const is_auth = is_auth_request(atom_name, api_request_paths.atom_path);
	const auth_action = get_auth_action(atom_name, route_name);
	
	const ip = context.identity?.sourceIp || event.headers['client-ip'] || event.headers['X-Nf-Client-Connection-Ip'];
	
	const params = get_params_from_route_path(atom_name, route_name, api_request_paths.route_path);
	
	if(event.body){
		api_request.body = event.body;
	}
	if(event.headers){
		api_request.headers = event.headers;
	}
	if(ip){
		api_request.ip = ip;
	}
	
	api_request.route_name = route_name;
	api_request.is_auth = is_auth;
	api_request.auth_action = auth_action;
	api_request.ip = ip;
	api_request.params = params;
	
	return api_request;
}

function _lambda_response(
	urn_resp:urn_response.General,
	headers?:LambdaHeaders,
	multi_value_headers?:LambdaMultiValueHeaders,
	is_base64?: boolean
):HandlerResponse{
	const handler_response:HandlerResponse = {
		statusCode: urn_resp.status,
		// body: JSON.stringify(urn_resp),
		body: urn_resp
	};
	if(headers){
		handler_response.headers = headers;
	}
	if(multi_value_headers){
		handler_response.multiValueHeaders = multi_value_headers;
	}
	if(typeof is_base64 === 'boolean'){
		handler_response.isBase64Encoded = is_base64;
	}
	return handler_response;
}

export function create():NetlifyLambda{
	urn_log.fn_debug(`Create NetlifyLambda`);
	return new NetlifyLambda();
}

