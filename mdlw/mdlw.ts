/**
 * Route middleware module
 *
 * @packageDocumentation
 */

import jwt from 'jsonwebtoken';

import {urn_response, urn_return, urn_exception, urn_log} from 'urn-lib';

const urn_ret = urn_return.create(urn_log.util.return_injector);

const urn_exc = urn_exception.init('EXPRESS_MDLW', 'Express middlewares');

import {api_book} from 'uranio-books/api';

import urn_core from 'uranio-core';

import {api_config} from '../conf/defaults';

import {handle_and_store_exception} from '../util/request';

import * as req_validator from './validate';

import * as types from '../types';

type Operation = (
	api_request: types.ApiRequest,
	log_blls: types.LogBlls,
	auth_handler?: types.AuthHandler
) => Promise<urn_response.General<any,any>>

async function _catch(operation:Operation, api_request:types.ApiRequest, log_blls:types.LogBlls, auth_handler?:types.AuthHandler){
	try{
		return await operation(api_request, log_blls, auth_handler);
	}catch(ex){
		const atom_request = _api_request_to_atom_request(api_request);
		return await handle_and_store_exception(ex, atom_request, log_blls.err);
	}
}

export async function route_middleware(api_request:types.ApiRequest, log_blls: types.LogBlls)
		:Promise<urn_response.General<any, any>>{
	return _catch(async (api_request: types.ApiRequest, log_blls:types.LogBlls) => {
		await _log_route_request(api_request, log_blls.req);
		const auth_reponse = await _authorization(api_request);
		if(auth_reponse){
			api_request = auth_reponse;
		}
		api_request = _limit(api_request);
		return await _validate_and_call(api_request);
	}, api_request, log_blls);
}

export async function auth_route_middleware(
	api_request: types.ApiRequest,
	log_blls: types.LogBlls,
	auth_handler: types.AuthHandler
):Promise<urn_response.General<any, any>>{
	return _catch(async (api_request: types.ApiRequest, log_blls:types.LogBlls, auth_handler?:types.AuthHandler) => {
		await _log_auth_route_request(api_request, log_blls.req);
		if(!auth_handler){
			throw urn_exc.create(`MISSING_AUTH_HANDLER`, `Missing auth handler.`);
		}
		return await _auth_validate_and_call(api_request, auth_handler);
	}, api_request, log_blls, auth_handler);
}

// function _api_request_to_route_request(api_request:types.ApiRequest) {
//   const api_request:types.ApiRequest = {
//     full_path: api_request.full_path,
//     method: api_request.method,
//     params: api_request.params,
//     query: api_request.query,
//     atom_name: api_request.atom_name,
//     route_name: api_request.route_name,
//   };
//   if(api_request.body){
//     api_request.body = api_request.body;
//   }
//   if(api_request.headers){
//     api_request.headers = api_request.headers;
//   }
//   if(api_request.ip){
//     api_request.ip = api_request.ip;
//   }
//   return api_request;
// }

async function _authorization(api_request:types.ApiRequest) {
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

function _limit(api_request:types.ApiRequest){
	let options = api_request.query?.options;
	if(!options){
		options = {};
	}
	if(!options.limit || options.limit > api_config.request_auto_limit){
		options.limit = api_config.request_auto_limit;
	}
	return api_request;
}

async function _validate_and_call(api_request: types.ApiRequest){
	
	const route_def = _get_route_def(api_request);
	
	urn_log.fn_debug(`Router ${route_def.method} ${route_def.url} [${api_request.atom_name}]`);
	
	_validate(api_request);
	
	let call_response = await route_def.call(api_request);
	
	call_response = urn_core.atm.util
		.hide_hidden_properties(api_request.atom_name, call_response);
	
	const urn_response = urn_ret.return_success('Success', call_response);
	
	return urn_response;
	
}

async function _auth_validate_and_call(
	auth_route_request: types.ApiRequest,
	handler: types.AuthHandler,
){
	const api_def = api_book[auth_route_request.atom_name as types.AuthName] as types.Book.BasicDefinition;
	
	if(!api_def.api){
		throw urn_exc.create('NOAPIDEF', `Invalid api definition`);
	}
	
	urn_log.fn_debug(`Router Auth ${api_def.api.url} [${auth_route_request.atom_name}]`);
	
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

function _auth_validate(api_request:types.ApiRequest)
		:void{
	
	urn_log.fn_debug(`Validate Auth Route [${api_request.atom_name}]`);
	
	req_validator.empty(api_request.params, 'params');
	req_validator.empty(api_request.query, 'query');
	
}

function _validate(api_request:types.ApiRequest)
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
		if(Array.isArray(route_def.query)){
			for(let i = 0; i < route_def.query.length; i++){
				api_request.query[route_def.query[i]!] = req_validator.process_request_query(api_request.query[route_def.query[i]!]);
			}
		}
	}else{
		req_validator.empty(api_request.query, 'query');
	}
	
}

function _get_route_def(api_request:types.ApiRequest)
		:types.Book.Definition.Api.Routes.Route{
	
	const atom_api = _get_route_api(api_request.atom_name);
	
	if(!atom_api.routes){
		// TODO implement generic routes.
		atom_api.routes = {};
	}
	
	if(!atom_api.routes[api_request.route_name]){
		throw urn_exc.create(`INVALID_ROUTE_NAME`, `Invalid route name.`);
	}
	
	// TODO _check_if_def_is_valid();
	
	return atom_api.routes[api_request.route_name]!;
}

function _get_route_api(atom_name:types.AtomName):types.Book.Definition.Api{
	
	const atom_api = api_book[atom_name as keyof typeof api_book].api as types.Book.Definition.Api;
	
	if(!atom_api){
		throw urn_exc.create(`INVLID_API_DEF`,'Invalid api definition in api_book.');
	}
	
	return atom_api;
	
}

function _api_request_to_atom_request(api_request: types.ApiRequest)
		:types.AtomShape<'request'>{
	const request_shape:types.AtomShape<'request'> = {
		full_path: api_request.full_path,
		route_path: api_request.route_path,
		atom_path: api_request.atom_path,
		connection_path: api_request.connection_path,
		method: api_request.method,
		atom_name: api_request.atom_name,
		route_name: api_request.route_name,
		auth_action: api_request.auth_action
	};
	if(api_request.ip){
		api_request.ip;
	}
	if(api_request.params && Object.keys(api_request.params).length > 0){
		request_shape.params = JSON.stringify(api_request.params);
	}
	if(api_request.query && Object.keys(api_request.query).length > 0){
		request_shape.query = JSON.stringify(api_request.query);
	}
	if(api_request.body && Object.keys(api_request.body).length > 0){
		request_shape.body = JSON.stringify(api_request.body);
	}
	return request_shape;
}

async function _log_route_request(
	api_request: types.ApiRequest,
	bll_reqs: urn_core.bll.BLL<'request'>
):Promise<types.AtomShape<'request'>>{
	
	const request_shape = _api_request_to_atom_request(api_request);
	
	try{
		// return await bll_requests.insert_new(request_shape);
		return await bll_reqs.insert_new(request_shape);
	}catch(ex){
		console.error('CANNOT LOG REQUEST', ex);
		// TODO save on file CANNOT LOG
		return request_shape;
	}
}

async function _log_auth_route_request(
	auth_request: types.ApiRequest,
	bll_reqs: urn_core.bll.BLL<'request'>
):Promise<types.AtomShape<'request'>>{
	// const atom_api = _get_route_api(auth_request.atom_name);
	
	const request_shape:types.AtomShape<'request'> = {
		full_path: auth_request.full_path,
		route_path: auth_request.route_path,
		atom_path: auth_request.atom_path,
		connection_path: auth_request.connection_path,
		method: auth_request.method,
		atom_name: auth_request.atom_name,
		route_name: auth_request.route_name,
		auth_action: auth_request.auth_action
	};
	if(auth_request.params && Object.keys(auth_request.params).length > 0){
		request_shape.params = JSON.stringify(auth_request.params);
	}
	if(auth_request.query && Object.keys(auth_request.query).length > 0){
		request_shape.query = JSON.stringify(auth_request.query);
	}
	if(auth_request.body && Object.keys(auth_request.body).length > 0){
		request_shape.body = JSON.stringify(auth_request.body);
	}
	const auth_request_clone = {...request_shape};
	if(auth_request_clone.body){
		const body = JSON.parse(auth_request_clone.body);
		body.password = '[DELETED]';
		auth_request_clone.body = JSON.stringify(body);
	}
	try{
		// return await bll_requests.insert_new(auth_request_clone);
		return await bll_reqs.insert_new(auth_request_clone);
	}catch(ex){
		console.error('CANNOT LOG AUTH REQUEST', ex);
		// TODO save on file CANNOT LOG
		return request_shape;
	}
}

// async function _handle_exception(
//   ex: urn_exception.ExceptionInstance,
//   atom_request: Partial<types.Atom<'request'>>,
//   bll_errs: urn_core.bll.BLL<'error'>
// ){
//   let status = 500;
//   let msg = 'Internal Server Error';
//   let error_code = '500';
//   let error_msg = ex.message;
//   if(ex.type){
//     error_code = ex.module_code + '_' + ex.error_code;
//     error_msg = ex.msg;
//   }
//   switch(ex.type){
//     case urn_exception.ExceptionType.UNAUTHORIZED:{
//       status = 401;
//       msg = 'Unauthorized';
//       break;
//     }
//     case urn_exception.ExceptionType.NOT_FOUND:{
//       status = 404;
//       msg = 'Not Found';
//       error_code = 'RECORD_NOT_FOUND';
//       error_msg = 'Record not found.';
//       break;
//     }
//     case urn_exception.ExceptionType.INVALID_REQUEST:{
//       status = 400;
//       msg = 'Invalid Request';
//       break;
//     }
//   }
//   const urn_res = urn_ret.return_error(
//     status,
//     msg,
//     error_code,
//     error_msg
//   );
//   await _store_error(urn_res, atom_request, bll_errs, ex);
//   // return res.status(status).json(urn_res);
//   return urn_res;
// }

// async function _store_error(
//   urn_res: urn_response.Fail,
//   atom_request: Partial<types.Atom<'request'>>,
//   bll_errs: urn_core.bll.BLL<'error'>,
//   ex?: urn_exception.ExceptionInstance,
// ):Promise<types.Atom<'error'> | undefined>{
//   try{
//     const error_log:types.AtomShape<'error'> = {
//       status: urn_res.status,
//       msg: '' + urn_res.message,
//       error_code: urn_res.err_code,
//       error_msg: urn_res.err_msg,
//     };
//     if(atom_request._id !== undefined){
//       error_log.request = atom_request._id;
//     }
//     if(ex && !ex.type){
//       error_log.stack = ex.stack;
//     }
//     // return await bll_errors.insert_new(error_log);
//     return await bll_errs.insert_new(error_log);
//   }catch(ex){
//     // TODO Save to file CANNOT LOG
//     console.error('CANNOT STORE ERROR', ex);
//     return undefined;
//   }
// }
