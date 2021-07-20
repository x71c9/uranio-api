/**
 * Lambda handle module
 *
 * @packageDocumentation
 */

// import {api_config} from '../conf/defaults';

// import {urn_log, urn_return, urn_exception, urn_response} from 'urn-lib';
import {urn_log, urn_return, urn_exception, urn_response, urn_util} from 'urn-lib';

// import {atom_book} from 'uranio-books/atom';

import urn_core from 'uranio-core';

import {api_book} from 'uranio-books/api';

const urn_exc = urn_exception.init(`LAMBDAMODULE`, `Lambda handle module.`);

const urn_ret = urn_return.create(urn_log.util.return_injector);

import * as types from '../types';

import {Book, AtomName} from '../types';

import {return_default_routes} from '../routes/';

import {Event, Context, HandlerResponse, Headers, MultiValueHeaders} from './types';

import {route_middleware, auth_route_middleware} from '../mdlw/';

export async function handle(event:Event, context:Context, log_blls:types.LogBlls)
		:Promise<HandlerResponse>{
	const path = event.path;
	try{
		_validate_path(path);
	}catch(err){
		const res_err = urn_ret.return_error(
			500,
			`Invalid path.`,
			`INVALID_PATH`,
			err.message,
			null,
			err
		);
		return _return_handler_response(res_err);
	}
	const {atom_name, route_name} = _process_event(event);
	const urn_response = await _lambda_route(event, context, atom_name, route_name, log_blls);
	return _return_handler_response(urn_response);
}

async function _lambda_route(
	event: Event,
	context:Context,
	atom_name:AtomName,
	route_name:keyof Book.Definition.Api.Routes,
	log_blls:types.LogBlls
){
	const raw_request = _lambda_to_raw_request(event, context);
	if(_is_auth_route(event, atom_name)){
		
		const auth_bll = urn_core.bll.auth.create(atom_name as types.AuthName);
		const auth_handler = async (route_request:types.RouteRequest) => {
			const token = await auth_bll.authenticate(
				route_request.body.email,
				route_request.body.password
			);
			return token;
		};
		
		return auth_route_middleware(atom_name as types.AuthName, route_name as string, auth_handler, raw_request, log_blls);
	}else{
		return route_middleware(atom_name, route_name, raw_request, log_blls);
	}
}

function _lambda_to_raw_request(event:Event, context:Context){
	
	const raw_request:types.RawRequest = {
		ip: context.identity?.sourceIp,
		body: event.body,
		headers: event.headers,
		query: event.queryStringParameters,
		// params: 
	};
	
	return raw_request;
	
}

function _is_auth_route(event:Event, atom_name:AtomName){
	const atom_api = api_book[atom_name]['api'] as Book.Definition.Api;
	if(urn_util.object.has_key(atom_api, 'auth')){
		const auth_url = atom_api['auth'];
		if(auth_url === event.path){
			return true;
		}
		
	}
	return false;
}

// function _get_route_def(atom_name:AtomName, route_name:keyof Book.Definition.Api.Routes){
//   const atom_api = _get_atom_api(atom_name);
//   if(!atom_api.routes){
//     throw urn_exc.create(`INVALID_API_DEF`, `Invalid api_def. Missing "routes" property.`);
//   }
//   const route_def = atom_api.routes[route_name];
//   if(!route_def){
//     throw urn_exc.create(`INVALID_ROUTE_NAME`, `Invalid route name for Atom [${atom_name}] Route name [${route_name}]`);
//   }
//   return route_def;
// }

function _validate_path(path:string){
	if(!path.includes('/uranio/api/')){
		throw urn_exc.create_invalid_request(
			`INVALID_PATH_WRONG_PREFIX`,
			`Invalid path. Invalid prefix.`
		);
	}
	const splitted_path = path.split('/uranio/api/');
	const url = splitted_path[1];
	const splitted_url = url.split('/');
	const api_url = splitted_url[0];
	if(!_is_valid_api_url(api_url)){
		throw urn_exc.create_invalid_request(
			`INVALID_PATH_WRONG_API_URL`,
			`Invalid path. Invalid api url. Api url not present in api_book.`
		);
	}
	return true;
}

function _process_event(event:Event){
	const path = event.path;
	const splitted_path = path.split('/uranio/api/');
	const url = splitted_path[1];
	const splitted_url = url.split('/');
	const api_url = splitted_url[0];
	let route_url = '/';
	if(splitted_path.length > 1){
		route_url += splitted_url.slice(1).join('/');
	}
	const atom_name = _get_atom_name_from_api_url(api_url);
	const route_name = _get_route_name(atom_name, route_url, event.httpMethod);
	return {atom_name, route_name};
}

function _get_route_name(atom_name:AtomName, route_url:string, http_method:types.RouteMethod){
	
	const atom_api = _get_atom_api(atom_name);
	if(!atom_api.routes){
		throw urn_exc.create(`INVALID_API_DEF`, `Invalid api_def. Missing "routes" property.`);
	}
	for(const route_name in atom_api.routes){
		const route_def = atom_api.routes[route_name];
		if(route_def.method === http_method){
			if(route_def.url === route_url){
				return route_name;
			}else if(route_def.url.includes(':')){
				const splitted_route_def_url = route_def.url.split('/');
				const splitted_route_url = route_url.split('/');
				if(splitted_route_def_url.length !== splitted_route_url.length){
					continue;
				}
				for(let i = 0; i < splitted_route_def_url.length; i++){
					const url_part = splitted_route_def_url[i];
					if(url_part.includes(':') || url_part === splitted_route_url[i]){
						continue;
					}
					throw urn_exc.create_invalid_request(
						`IVALID_ROUTE_PATH`,
						`Invalid route path.`
					);
				}
				return route_name;
			}
		}
	}
	throw urn_exc.create_invalid_request(
		`INVALID_PATH_ROUTE_NOT_FOUND`,
		`Invalid path. Route not found or invalid.`
	);
}

function _get_atom_api(atom_name:AtomName){

	const atom_api = api_book[atom_name as keyof typeof api_book].api as
		Book.Definition.Api;
	
	const default_routes = return_default_routes(atom_name);
	
	if(!atom_api.routes){
		
		atom_api.routes = default_routes;
		
	}else{
		
		atom_api.routes = {
			...default_routes,
			...atom_api.routes
		};
		
	}
	
	return atom_api;
}

function _get_atom_name_from_api_url(api_url:string)
		:AtomName{
	let atom_name:keyof typeof api_book;
	for(atom_name in api_book){
		const api_def = api_book[atom_name] as Book.Definition<typeof atom_name>;
		if(api_def.api && api_def.api.url && api_def.api.url === api_url){
			return atom_name;
		}
	}
	throw urn_exc.create(`INVALID_API_URL`, `Invalid api url.`);
}

function _is_valid_api_url(api_url:string){
	let atom_name:keyof typeof api_book;
	for(atom_name in api_book){
		const api_def = api_book[atom_name] as Book.Definition<typeof atom_name>;
		if(api_def.api && api_def.api.url && api_def.api.url === api_url){
			return true;
		}
	}
	return false;
}

function _return_handler_response(
	urn_resp:urn_response.General,
	headers?:Headers,
	multi_value_headers?:MultiValueHeaders,
	is_base64?: boolean
):HandlerResponse{
	const handler_response = {
		statusCode: urn_resp.status,
		body: JSON.stringify(urn_resp),
		headers: headers,
		multiValueHeaders: multi_value_headers,
		isBase64Encoded: is_base64
	};
	return handler_response;
}
