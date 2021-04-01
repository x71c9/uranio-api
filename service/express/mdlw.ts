/**
 * Express default route middleware module
 *
 * @packageDocumentation
 */

import express from 'express';

import jwt from 'jsonwebtoken';

import {urn_response, urn_return, urn_exception, urn_log} from 'urn-lib';

const urn_ret = urn_return.create(urn_log.util.return_injector);

const urn_exc = urn_exception.init('EXPRESS_MDLW', 'Express middlewares');

import {api_book} from 'urn_books';

import urn_core from '../../core/';

import {web_config} from '../../conf/defaults';

import * as req_validator from './routes/validate';

import {
	Atom,
	AtomName,
	AuthName,
	AtomShape,
	Passport,
	RouteRequest,
	RouteMethod,
	Book,
} from '../../types';

const bll_requests = urn_core.bll.log.create('request');
const bll_errors = urn_core.bll.log.create('error');

export function route_middlewares<A extends AtomName>(
	atom_name: A,
	route_name: string
):express.RequestHandler[]{
	return [
		_locals(atom_name, route_name),
		_log(),
		_authorization(),
		_limit(),
		_validate_and_catch(),
	];
}

type AuthHandler = (route_request:RouteRequest) => Promise<string>;

export function auth_route_middlewares<A extends AuthName>(
	atom_name: A,
	route_name: string,
	handler: AuthHandler
):express.RequestHandler[]{
	return [
		_locals(atom_name, route_name),
		_auth_log(),
		_auth_validate_and_catch(handler)
	];
}

function _locals<A extends AtomName>(atom_name:A, route_name:string) {
	return (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		
		const route_request:RouteRequest = {
			params: req.params,
			query: req.query,
			body: req.body,
			atom_name: atom_name,
			route_name: route_name,
			ip: req.ip
		};
		
		res.locals.urn = route_request;
		
		return next();
	};
}

function _log() {
	return async (
		_req: express.Request,
		res:express.Response,
		next:express.NextFunction
	) => {
		
		const route_request = _get_route_request(res);
		
		try {
			await _log_request(route_request);
		}catch(ex){
			console.error('CANNOT LOG', ex);
			// TODO save on file CANNOT LOG
		}
		return next();
		
	};
}

function _auth_log() {
	return async (
		_req: express.Request,
		res:express.Response,
		next:express.NextFunction
	) => {
		
		const route_request = _get_route_request(res);
		
		try {
			await _log_auth_request(route_request);
		}catch(ex){
			console.error('CANNOT AUTH LOG', ex);
			// TODO save on file CANNOT LOG
		}
		return next();
		
	};
}

function _authorization() {
	return async (
		req:express.Request,
		res:express.Response,
		next:express.NextFunction
	) => {
		
		const route_request = _get_route_request(res);
		const route_def = _get_route_def(route_request);
		
		if(urn_core.bll.auth.is_public_request(route_request.atom_name, route_def.action)){
			return next();
		}
		
		const token = req.header('x-auth-token');
		
		if(!token){
			return next();
		}
			
		try{
			
			const decoded = jwt.verify(token, web_config.jwt_private_key) as Passport;
			res.locals.urn.passport = decoded;
			
		}catch(ex){
			ex.stack = '';
			const urn_res = urn_ret.return_error(
				400,
				'Invalid request',
				'INVALID_TOKEN',
				'Invalid token.',
			);
			await store_error(urn_res, res, ex);
			return res.status(400).send(urn_res);
		}
		return next();
		
	};
}

function _limit()
		:express.RequestHandler{
	return (_req:express.Request, res:express.Response, next:express.NextFunction) => {
		
		const route_request = _get_route_request(res);
		let options = route_request.query.options;
		if(!options){
			options = {};
		}
		if(!options.limit || options.limit > web_config.request_auto_limit){
			options.limit = web_config.request_auto_limit;
		}
		return next();
	};
}

function _validate_and_catch()
		:express.RequestHandler{
	
	return async (_req: express.Request, res:express.Response) => {
		
		try{
			
			const route_request = _get_route_request(res);
			const route_def = _get_route_def(route_request);
			
			urn_log.fn_debug(`Router ${route_def.method} ${route_def.url} [${route_request.atom_name}]`);
			
			_validate(route_request);
			
			let call_response = await route_def.call(route_request);
			
			call_response = urn_core.atm.util
				.hide_hidden_properties(route_request.atom_name, call_response);
			
			const urn_response = urn_ret.return_success('Success', call_response);
			
			return res.status(200).json(urn_response);
			
		}catch(ex){
			
			return _handle_exception(ex, res);
			
		}
		
	};
}

function _auth_validate_and_catch(handler:AuthHandler)
		:express.RequestHandler{
	
	return async (_req: express.Request, res:express.Response) => {
		
		try{
			
			const route_request = _get_route_request(res);
			
			const api_def = api_book[route_request.atom_name as AuthName] as Book.BasicDefinition;
			
			if(!api_def.api){
				throw urn_exc.create('NOAPIDEF', `Invalid api definition`);
			}
			
			urn_log.fn_debug(`Router Auth ${api_def.api.url} [${route_request.atom_name}]`);
			
			_auth_validate(route_request);
			
			const token = await handler(route_request);
			
			const urn_response = urn_ret.return_success('Success', {token: token});
			
			return res.header('x-auth-token', token).status(200).send(urn_response);
			
		}catch(ex){
			
			switch(ex.type){
				case urn_exception.ExceptionType.AUTH_NOT_FOUND:
				case urn_exception.ExceptionType.AUTH_INVALID_PASSWORD:{
					const status = 400;
					const msg = 'Invalid auth request';
					const error_code = 'INVALID_AUTH_REQUEST';
					const error_msg = 'User or password are not valid.';
					const urn_res = urn_ret.return_error(
						status,
						msg,
						error_code,
						error_msg
					);
					await store_error(urn_res, res, ex);
					return res.status(status).json(urn_res);
				}
				default:{
					return _handle_exception(ex, res);
				}
			}
			
		}
		
	};
}

function _auth_validate(route_request:RouteRequest)
		:void{
	
	urn_log.fn_debug(`Validate Auth Route [${route_request.atom_name}]`);
	
	req_validator.empty(route_request.params, 'params');
	req_validator.empty(route_request.query, 'query');
	
}

function _validate(route_request:RouteRequest)
		:void{
	
	const route_def = _get_route_def(route_request);
		
	urn_log.fn_debug(`Validate Route ${route_def.url} [${route_request.atom_name}]`);
	
	if(route_def.method === RouteMethod.GET){
		req_validator.empty(route_request.body, 'body');
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
		req_validator.only_valid_param_keys(route_request.params, param_names);
	}else{
		req_validator.empty(route_request.params, 'params');
	}
	
	if(route_def.query){
		req_validator.only_valid_query_keys(route_request.query, route_def.query);
		if(Array.isArray(route_def.query)){
			for(let i = 0; i < route_def.query.length; i++){
				route_request.query[route_def.query[i]!] = req_validator.process_request_query(route_request.query[route_def.query[i]!]);
			}
		}
	}else{
		req_validator.empty(route_request.query, 'query');
	}
	
}

function _get_route_def(route_request:RouteRequest)
		:Book.Definition.Api.Routes.Route{
	
	const atom_api = _get_route_api(route_request.atom_name);
	
	if(!atom_api.routes){
		// TODO implement generic routes.
		atom_api.routes = {};
	}
	
	if(!atom_api.routes[route_request.route_name]){
		throw urn_exc.create(`INVALID_ROUTE_NAME`, `Invalid route name.`);
	}
	
	// TODO _check_if_def_is_valid();
	
	return atom_api.routes[route_request.route_name]!;
}

function _get_route_request(res:express.Response)
		:RouteRequest{
		
	const route_request = res.locals.urn as RouteRequest;
	
	if(!route_request){
		const err_msg = 'Express response locals.urn has not been set.';
		throw urn_exc.create_invalid_request('LOCALS_NOT_SET', err_msg);
	}
	
	// TODO _check_if_request_is_valid()
	
	return route_request;
}

function _get_route_api(atom_name:AtomName):Book.Definition.Api{
	
	const atom_api = api_book[atom_name as keyof typeof api_book].api as Book.Definition.Api;
	
	if(!atom_api){
		throw urn_exc.create(`INVLID_API_DEF`,'Invalid api definition in api_book.');
	}
	
	return atom_api;
	
}

// function _get_api_route(atom_name:AtomName, route_name:string)
//     :Book.Definition.Api.Routes.Route{
//   const atom_api = _get_route_api(atom_name);
	
//   if(!atom_api.routes){
//     //TODO implements generic routes
//     atom_api.routes = {};
//   }
	
//   if(!atom_api.routes[route_name]){
//     const err_msg = `Invalid route name [${atom_name}] [${route_name}].`;
//     throw urn_exc.create_invalid_request(`INVALID_ROUTE_NAME`, err_msg);
//   }
	
//   return atom_api.routes[route_name];
	
// }

// function _catch(handler:Handler):express.RequestHandler{
//   return async (req: express.Request, res:express.Response, next:express.NextFunction) => {
//     try{
//       await handler(req, res, next);
//     }catch(ex){
//       _handle_exception(ex, res);
//     }
//   };
// }

async function _log_request(route_request:RouteRequest)
		:Promise<AtomShape<'request'>>{
	
	// const atom_api = atom_book[route_request.atom_name].api as Book.Definition.Api;
	
	const atom_api = _get_route_api(route_request.atom_name);
	
	// const route_def = _get_route_def
	
	// if(!atom_api.routes){
	//   // TODO implement generic routes.
	//   atom_api.routes = {};
	// }
	// if(!atom_api.routes[route_request.route_name]){
	//   throw urn_exc.create_invalid_request(`INVALID_ROUTE_NAME`, `Invalid route name.`);
	// }
	
	const route_def = _get_route_def(route_request);
	
	const request_shape:AtomShape<'request'> = {
		url: `${route_def.method.toUpperCase()}: /${atom_api.url}${route_def.url}`,
		ip: route_request.ip,
		atom_name: route_request.atom_name,
		auth_action: route_def.action
	};
	if(Object.keys(route_request.params).length > 0){
		request_shape.params = JSON.stringify(route_request.params);
	}
	if(Object.keys(route_request.query).length > 0){
		request_shape.query = JSON.stringify(route_request.query);
	}
	if(Object.keys(route_request.body).length > 0){
		request_shape.body = JSON.stringify(route_request.body);
	}
	try{
		return await bll_requests.insert_new(request_shape);
	}catch(ex){
		console.error('CANNOT LOG REQUEST', ex);
		// TODO save on file CANNOT LOG
		return request_shape;
	}
}

async function _log_auth_request(auth_request:RouteRequest)
		:Promise<AtomShape<'request'>>{
	const atom_api = _get_route_api(auth_request.atom_name);
	
	const request_shape:AtomShape<'request'> = {
		url: `POST: /${atom_api.auth}`,
		ip: auth_request.ip,
		atom_name: auth_request.atom_name,
		auth_action: urn_core.types.AuthAction.AUTH
	};
	if(Object.keys(auth_request.params).length > 0){
		request_shape.params = JSON.stringify(auth_request.params);
	}
	if(Object.keys(auth_request.query).length > 0){
		request_shape.query = JSON.stringify(auth_request.query);
	}
	if(Object.keys(auth_request.body).length > 0){
		request_shape.body = JSON.stringify(auth_request.body);
	}
	const auth_request_clone = {...request_shape};
	if(auth_request_clone.body){
		const body = JSON.parse(auth_request_clone.body);
		body.password = '[DELETED]';
		auth_request_clone.body = JSON.stringify(body);
	}
	try{
		return await bll_requests.insert_new(auth_request_clone);
	}catch(ex){
		console.error('CANNOT LOG AUTH REQUEST', ex);
		// TODO save on file CANNOT LOG
		return request_shape;
	}
}

async function _handle_exception(
	ex:urn_exception.ExceptionInstance,
	res:express.Response
){
	let status = 500;
	let msg = 'Internal Server Error';
	let error_code = '500';
	let error_msg = ex.message;
	if(ex.type){
		error_code = ex.module_code + '_' + ex.error_code;
		error_msg = ex.msg;
	}
	switch(ex.type){
		case urn_exception.ExceptionType.UNAUTHORIZED:{
			status = 401;
			msg = 'Unauthorized';
			break;
		}
		case urn_exception.ExceptionType.NOT_FOUND:{
			status = 404;
			msg = 'Not Found';
			error_code = 'RECORD_NOT_FOUND';
			error_msg = 'Record not found.';
			break;
		}
		case urn_exception.ExceptionType.INVALID_REQUEST:{
			status = 400;
			msg = 'Invalid Request';
			break;
		}
	}
	const urn_res = urn_ret.return_error(
		status,
		msg,
		error_code,
		error_msg
	);
	await store_error(urn_res, res, ex);
	return res.status(status).json(urn_res);
	
}

export async function store_error(urn_res:urn_response.Fail, res:express.Response, ex?:urn_exception.ExceptionInstance)
		:Promise<Atom<'error'> | undefined>{
	try{
		const error_log:AtomShape<'error'> = {
			status: urn_res.status,
			msg: '' + urn_res.message,
			error_code: urn_res.err_code,
			error_msg: urn_res.err_msg,
		};
		if(res.locals.urn && res.locals.urn.request){
			error_log.request = res.locals.urn.request._id;
		}
		if(ex && !ex.type){
			error_log.stack = ex.stack;
		}
		return await bll_errors.insert_new(error_log);
	}catch(ex){
		// TODO Save to file CANNOT LOG
		console.error('CANNOT STORE ERROR', ex);
		return undefined;
	}
}
