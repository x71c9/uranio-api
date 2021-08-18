/**
 * Route middleware module
 *
 * @packageDocumentation
 */

import jwt from 'jsonwebtoken';

import {urn_util, urn_response, urn_return, urn_exception, urn_log} from 'urn-lib';

const urn_ret = urn_return.create(urn_log.util.return_injector);

const urn_exc = urn_exception.init('EXPRESS_MDLW', 'Express middlewares');

import {dock_book} from 'uranio-books/dock';

import urn_core from 'uranio-core';

import {api_config} from '../conf/defaults';

import {return_default_routes} from '../routes/';

import * as insta from '../nst/';

import {partial_api_request_to_atom_request} from '../util/request';

import * as req_validator from './validate';

import * as types from '../types';

export async function route_middleware<A extends types.AtomName, R extends types.RouteName<A>>(api_request:types.Api.Request<A,R>)
		:Promise<urn_response.General<any, any>>{
	_log_route_request(api_request);
	const auth_reponse = await _authorization(api_request);
	if(auth_reponse){
		api_request = auth_reponse;
	}
	api_request = _limit(api_request);
	return await _validate_and_call(api_request);
}

export async function auth_route_middleware<A extends types.AtomName, R extends types.RouteName<A>>(
	api_request: types.Api.Request<A,R>,
	auth_handler: types.AuthHandler<A,R>
):Promise<urn_response.General<any, any>>{
	_log_auth_route_request(api_request);
	if(typeof auth_handler !== 'function'){
		throw urn_exc.create(`INVALID_AUTH_HANDLER`, `Missing or invalid auth handler.`);
	}
	return await _auth_validate_and_call(api_request, auth_handler);
}

async function _authorization<A extends types.AtomName, R extends types.RouteName<A>>(api_request:types.Api.Request<A,R>) {
	const route_def = _get_route_def(api_request);
	if(urn_core.bll.auth.is_public_request(api_request.atom_name, route_def.action)){
		return false;
	}
	if(api_request.headers === undefined){
		return false;
	}
	const auth_header = api_request.headers['x-auth-token'];
	const auth_token = (Array.isArray(auth_header)) ? auth_header[0] : auth_header;
	if(!auth_token){
		return false;
	}
	try{
		const decoded = jwt.verify(auth_token, api_config.jwt_private_key) as types.Passport;
		api_request.passport = decoded;
		return api_request;
	}catch(ex){
		throw urn_exc.create_unauthorized(`INVALID_TOKEN`, `Invalid token.`, ex);
	}
}

async function _validate_and_call<A extends types.AtomName, R extends types.RouteName<A>>(api_request: types.Api.Request<A,R>){
	
	const route_def = _get_route_def(api_request);
	
	urn_log.fn_debug(`Router ${route_def.method} [${api_request.atom_name}] ${api_request.full_path}`);
	
	_validate_route(api_request);
	
	if(!urn_util.object.has_key(route_def, 'call') || !route_def.call){
		return urn_ret.return_error(
			404,
			`Route call not implemented.`,
			`ROUTE_CALL_NOT_IMPLEMENTED`,
			`Route call not implemented.`
		);
	}
	
	let call_response = await route_def.call(api_request);
	
	call_response = urn_core.atm.util
		.hide_hidden_properties(api_request.atom_name, call_response);
	
	const urn_response = urn_ret.return_success('Success', call_response);
	
	return urn_response;
	
}

async function _auth_validate_and_call<A extends types.AtomName, R extends types.RouteName<A>>(
	auth_route_request: types.Api.Request<A,R>,
	handler: types.AuthHandler<A,R>,
){
	const dock_def = dock_book[auth_route_request.atom_name as types.AuthName] as types.Book.BasicDefinition;
	
	if(!dock_def.dock){
		throw urn_exc.create('NOAPIDEF', `Invalid dock definition`);
	}
	
	urn_log.fn_debug(`Router Auth ${dock_def.dock.url} [${auth_route_request.atom_name}]`);
	
	_auth_validate(auth_route_request);
	
	const auth_token = await handler(auth_route_request);
	
	const urn_response = urn_ret.return_success('Success', {
		token: auth_token,
		headers: {
			'x-auth-token': auth_token
		}
	});
	
	return urn_response;
	
}

function _auth_validate<A extends types.AtomName, R extends types.RouteName<A>>(api_request:types.Api.Request<A,R>)
		:void{
	
	urn_log.fn_debug(`Validate Auth Route [${api_request.atom_name}]`);
	
	req_validator.empty(api_request.params, 'params');
	req_validator.empty(api_request.query, 'query');
	
}

function _validate_route<A extends types.AtomName, R extends types.RouteName<A>>(api_request:types.Api.Request<A,R>)
		:void{
	
	const route_def = _get_route_def(api_request);
		
	urn_log.fn_debug(`Validate Route ${route_def.url} [${api_request.atom_name}]`);
	
	if(route_def.method === types.RouteMethod.GET){
		req_validator.empty(api_request.body, 'body');
	}
	
	if(route_def.url.indexOf(':') !== -1){
		const param_names:string[] = [];
		const folds = route_def.url.split('/');
		for(let i = 0; i < folds.length; i++){
			const splitted = folds[i]!.split(':');
			if(splitted.length === 2){
				param_names.push(splitted[1]!);
			}
		}
		req_validator.only_valid_param_keys(api_request.params, param_names);
	}else{
		req_validator.empty(api_request.params, 'params');
	}
	
	if(route_def.query){
		req_validator.only_valid_query_keys(api_request.query, route_def.query);
		// if(Array.isArray(route_def.query)){
		//   for(let i = 0; i < route_def.query.length; i++){
		//     api_request.query[route_def.query[i]! as types.RouteQueryParam<A,R>] =
		//       req_validator.process_request_query<A>(
		//         api_request.query[route_def.query[i]! as types.RouteQueryParam<A,R>]
		//       ) as any;
		//   }
		// }
	}else{
		req_validator.empty(api_request.query, 'query');
	}
	
}

function _limit<A extends types.AtomName, R extends types.RouteName<A>>(
	api_request:types.Api.Request<A,R>
){
	let options = (api_request.query as any)?.options;
	if(!options){
		options = {};
	}
	if(!options.limit || options.limit > api_config.request_auto_limit){
		options.limit = api_config.request_auto_limit;
	}
	return api_request;
}

function _get_route_def<A extends types.AtomName, R extends types.RouteName<A>>(api_request:types.Api.Request<A,R>)
		:types.Book.Definition.Dock.Routes.Route<A,R>{
	
	const atom_dock = _get_atom_dock<A>(api_request.atom_name);
	
	const default_routes = return_default_routes(api_request.atom_name);
	
	if(!atom_dock.routes){
		atom_dock.routes = default_routes;
	}else{
		atom_dock.routes = {
			...default_routes,
			...atom_dock.routes
		};
	}
	
	if(!atom_dock.routes[api_request.route_name]){
		throw urn_exc.create(`INVALID_ROUTE_NAME`, `Invalid route name.`);
	}
	
	return atom_dock.routes[api_request.route_name]!;
}

function _get_atom_dock<A extends types.AtomName>(atom_name:A)
		:types.Book.Definition.Dock{
	
	const atom_dock = dock_book[atom_name as keyof typeof dock_book].dock as
		types.Book.Definition.Dock;
	
	if(!atom_dock){
		throw urn_exc.create(
			`INVLID_API_DEF`,
			'Invalid api definition in api_book.'
		);
	}
	
	return atom_dock;
	
}

function _log_route_request<A extends types.AtomName, R extends types.RouteName<A>>(api_request: types.Api.Request<A,R>)
		:void{
	const request_shape = partial_api_request_to_atom_request(api_request);
	const bll_reqs = insta.get_bll_request();
	bll_reqs.insert_new(request_shape).catch((ex) => {
		console.error('CANNOT LOG REQUEST', ex);
		// ****
		// TODO save on file CANNOT LOG
		// ****
		return request_shape;
	});
}

function _log_auth_route_request<A extends types.AtomName, R extends types.RouteName<A>>(auth_request: types.Api.Request<A,R>)
		:void{
	const request_shape = partial_api_request_to_atom_request(auth_request);
	const auth_request_clone = {...request_shape};
	if(auth_request_clone.body){
		const body = JSON.parse(auth_request_clone.body);
		body.password = '[DELETED]';
		auth_request_clone.body = JSON.stringify(body);
	}
	
	const bll_reqs = insta.get_bll_request();
	bll_reqs.insert_new(auth_request_clone).catch((ex) => {
		console.error('CANNOT LOG AUTH REQUEST', ex);
		// ****
		// TODO save on file CANNOT LOG
		// ****
		return request_shape;
	});
}

// function partial_api_request_to_atom_request(api_request: types.Api.Request)
//     :types.AtomShape<'request'>{
//   const request_shape:types.AtomShape<'request'> = {
//     full_path: api_request.full_path,
//     route_path: api_request.route_path,
//     atom_path: api_request.atom_path,
//     connection_path: api_request.connection_path,
//     method: api_request.method,
//     atom_name: api_request.atom_name,
//     route_name: api_request.route_name,
//     auth_action: api_request.auth_action
//   };
//   if(api_request.ip){
//     api_request.ip;
//   }
//   if(api_request.params && Object.keys(api_request.params).length > 0){
//     request_shape.params = JSON.stringify(api_request.params);
//   }
//   if(api_request.query && Object.keys(api_request.query).length > 0){
//     request_shape.query = JSON.stringify(api_request.query);
//   }
//   if(api_request.body && Object.keys(api_request.body).length > 0){
//     request_shape.body = JSON.stringify(api_request.body);
//   }
//   return request_shape;
// }

