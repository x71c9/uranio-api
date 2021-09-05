/**
 * Netlify class module
 *
 * @packageDocumentation
 */

import {urn_log, urn_response, urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init('NETLIFYCLASS', 'Netlify class module');

import urn_core from 'uranio-core';

import {
	process_request_path,
	get_atom_name_from_atom_path,
	get_route_name,
	is_auth_request,
	get_params_from_route_path,
	get_auth_action,
	api_handle_and_store_exception,
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

import {map_lambda_query_params} from '../util';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
class NetlifyLambda implements Lambda {
	
	public async handle(event:LambdaEvent, context:LambdaContext)
			:Promise<HandlerResponse> {
		const partial_api_request = _lambda_request_to_partial_api_request(event, context);
		try{
			const api_request = validate_request(partial_api_request);
			const urn_res = await this.lambda_route(api_request);
			// urn_core.disconnect().then(() => {
			//   urn_log.debug(`Database disconnected.`);
			// });
			return _lambda_response(urn_res);
		}catch(ex){
			const urn_err = api_handle_and_store_exception(ex, partial_api_request);
			return _lambda_response(urn_err);
		}
	}
	
	public async lambda_route<A extends types.AtomName, R extends types.RouteName<A>>(api_request:types.Api.Request<A,R>){
		if(api_request.is_auth){
			// ****
			// TODO CHECK - Maybe this can be a bad idea - to create the BLL on request
			// instead of passing only one reference. But it must be for each auth atom.
			// We do it anyway a bll for each call depending on the `path`.
			// ****
			const auth_bll = urn_core.bll.auth.create(api_request.atom_name as types.AuthName);
			const auth_handler = async (api_request:types.Api.Request<A,R>) => {
				const token = await auth_bll.authenticate(
					api_request.body.email,
					api_request.body.password
				);
				return token;
			};
			return auth_route_middleware(api_request, auth_handler);
		}else{
			return route_middleware(api_request);
		}
	}
	
}

function _lambda_request_to_partial_api_request(event: LambdaEvent, context: LambdaContext){
	
	const api_request_paths = process_request_path(event.path);
	
	const api_request:Partial<types.Api.Request<any,any>> = {
		...api_request_paths,
		method: event.httpMethod,
		params: {},
		query: map_lambda_query_params(event.queryStringParameters || {}),
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
	
	// ----
	// For some reason when TRX call a `delete` hook, the lambda Netlify function
	// receives a string type `body` equal to `[object Object]`.
	// I tried to debug. It seems Axios is not responsible. It should not send any
	// body with DELETE method.
	// I tried to remove the netlify redirect but with no success.
	// It might be something in the Netlify Lambda function.
	// ----
	if(event.body === '[object Object]'){
		event.body = null;
	}
	if(event.body){
		try{
			api_request.body = (typeof event.body === 'string') ?
				JSON.parse(event.body) : event.body;
		}catch(err){
			throw urn_exc.create_invalid_request(
				`INVALID_BODY_REQUEST`,
				`Invalid body format. Body must be in JSON format.`,
				err
			);
		}
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
		body: urn_util.json.safe_stringify(urn_resp),
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

