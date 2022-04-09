/**
 * Netlify class module
 *
 * @packageDocumentation
 */

// import parse_multipart from 'parse-multipart';

import {urn_log, urn_response, urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init('NETLIFYCLASS', 'Netlify class module');

import core from 'uranio-core';

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

import {route_middleware, auth_route_middleware} from '../../mdlw/server';

import * as types from '../../server/types';

import {schema} from '../../sch/server';

import {
	Lambda,
	LambdaEvent,
	LambdaContext,
	HandlerResponse,
	LambdaHeaders,
	LambdaMultiValueHeaders
} from '../types';

// import {map_lambda_query_params, parse_multipart} from '../util';
import {map_lambda_query_params, lambra_multipart_parse} from '../util';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
class NetlifyLambda implements Lambda {
	
	// constructor(connect=false){
	//   if(connect === true){
	//     core.db.connect();
	//   }
	// }
	
	public async handle(event:LambdaEvent, context:LambdaContext)
			:Promise<HandlerResponse> {
		const partial_api_request = _lambda_request_to_partial_api_request(
			event,
			context
		);
		try{
			// This will throw an error if it cannot JSON parse the body.
			// That is why it is outside `_lambda_request_to_partial_api_request`
			const body = await _filter_lambda_body_request(event, partial_api_request);
			if(body){
				partial_api_request.body = body;
			}
			const api_request = validate_request(partial_api_request);
			const urn_res = await this.lambda_route(api_request);
			// core.disconnect().then(() => {
			//   urn_log.debug(`Database disconnected.`);
			// });
			return _lambda_response(urn_res);
		}catch(e){
			const ex = e as any;
			const urn_err = api_handle_and_store_exception(ex, partial_api_request);
			return _lambda_response(urn_err);
		}
	}
	
	public async lambda_route<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth>(
		api_request:types.Api.Request<A,R,D>
	){
		if(api_request.is_auth){
			// ****
			// TODO CHECK - Maybe this can be a bad idea - to create the BLL on request
			// instead of passing only one reference. But it must be for each auth atom.
			// We do it anyway a bll for each call depending on the `path`.
			// ****
			const auth_bll = core.bll.auth.create(
				api_request.atom_name as schema.AuthName
			);
			const auth_handler = async (api_request:types.Api.Request<A,R,D>) => {
				const token = await auth_bll.authenticate(
					api_request.body?.email,
					api_request.body?.password
				);
				return token;
			};
			return auth_route_middleware(api_request, auth_handler);
		}else{
			return route_middleware(api_request);
		}
	}
	
}

async function _filter_lambda_body_request(event:LambdaEvent, api_request:Partial<types.Api.Request<any,any,any>>){
	
	let body = null;
	// ----
	// For some reason when TRX call a `delete` hook, the lambda Netlify function
	// receives a string type `body` equal to `[object Object]`.
	// I tried to debug. It seems Axios is not responsible. It should not send any
	// body with DELETE method.
	// I tried to remove the netlify redirect but with no success.
	// It might be something in the Netlify Lambda function.
	// ----
	if (event.body === "[object Object]") {
		event.body = null;
	}
	
	if(event.isBase64Encoded === true && typeof event.body === 'string'){
		api_request.file = {
			name: '[NONAME]',
			data: Buffer.from(''),
			size: 0,
			mime_type: ''
		};
		
		if(event.headers['content-type']?.indexOf('multipart/form-data') === 0){
			const multipart = await lambra_multipart_parse(event);
			api_request.file.name = multipart.files[0].filename;
			api_request.file.data = multipart.files[0].content;
			api_request.file.mime_type = multipart.files[0].contentType;
			api_request.file.size = multipart.files[0].content.length;
			
			// const content_type = event.headers['content-type'];
			// const boundary = content_type.split(';')[1]?.trim().split('=')[1]?.trim();
			// if(boundary){
			//   const buffer = Buffer.from(event.body, 'base64');
			//   const parts = parse_multipart(buffer, boundary);
			//   for(const part of parts.reverse()){
			//     if(typeof part.filename === 'string' && Buffer.isBuffer(part.data)){
			//       api_request.file.name = part.filename;
			//       api_request.file.data = part.data;
			//       api_request.file.mime_type = part.type || '';
			//       api_request.file.size = part.data.length;
			//       break;
			//     }
			//   }
			//   return null;
			// }
		}
		
		return '[Base64Body]';
		
	}
	
	if (event.body) {
		try {
			body =
				typeof event.body === "string" ? JSON.parse(event.body) : event.body;
		} catch (e) {
			const err = e as any;
			throw urn_exc.create_invalid_request(
				`INVALID_BODY_REQUEST`,
				`Invalid body format. Body must be in JSON format.`,
				err
			);
		}
	}
	return body;
}

function _lambda_request_to_partial_api_request(event: LambdaEvent, context: LambdaContext){
	
	const api_request_paths = process_request_path(event.path);
	
	const api_request:Partial<types.Api.Request<any,any,any>> = {
		...api_request_paths,
		method: event.httpMethod,
		params: {} as any,
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
	
	if(is_auth){
		api_request.auth_action = core.types.AuthAction.READ;
		api_request.route_name = 'auth';
	}
	
	return api_request;
}

function _lambda_response(
	urn_resp:urn_response.General<any>,
	headers?:LambdaHeaders,
	multi_value_headers?:LambdaMultiValueHeaders,
	is_base64?: boolean
):HandlerResponse{
	const handler_response:HandlerResponse = {
		statusCode: urn_resp.status,
	};
	if(urn_resp.meta?.headers){
		handler_response.headers = urn_resp.payload.headers;
		delete urn_resp.meta.headers;
	}
	if(headers){
		handler_response.headers = headers;
	}
	if(urn_resp.meta?.multi_value_headers){
		handler_response.multiValueHeaders = urn_resp.meta.multi_value_headers;
		delete urn_resp.meta.multi_value_headers;
	}
	if(multi_value_headers){
		handler_response.multiValueHeaders = multi_value_headers;
	}
	if(typeof is_base64 === 'boolean'){
		handler_response.isBase64Encoded = is_base64;
	}
	handler_response.body = urn_util.json.safe_stringify(urn_resp);
	return handler_response;
}

export function create():NetlifyLambda{
	urn_log.fn_debug(`Create NetlifyLambda`);
	return new NetlifyLambda();
}

// export function connect_and_create():NetlifyLambda{
//   urn_log.fn_debug(`Create NetlifyLambda`);
//   return new NetlifyLambda(true);
// }
