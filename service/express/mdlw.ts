/**
 * Express default route middleware module
 *
 * @packageDocumentation
 */

import express from 'express';

import jwt from 'jsonwebtoken';

import {urn_response, urn_return, urn_exception, urn_log} from 'urn-lib';

const urn_ret = urn_return.create(urn_log.return_injector);

const urn_exc = urn_exception.init('EXPRESS_MDLW', 'Express middlewares');

import urn_core from 'urn_core';

import {web_config} from '../../conf/defaults';

import {
	Atom,
	AtomName,
	AtomShape,
	TokenObject,
	AuthAction
} from '../../types';

const bll_requests = urn_core.bll.log.create('request');
const bll_errors = urn_core.bll.log.create('error');

type Handler = (req:express.Request, res:express.Response, next?:express.NextFunction) => Promise<any>

// export function route_middlewares_old(atom_name:AtomName, action: AuthAction, handler:Handler)
//     :express.RequestHandler[]{
//   return [_locals(atom_name, action), _log, _authorization,  _catch(handler)];
// }

export function route_middlewares(atom_name:AtomName, action: AuthAction, handler:Handler)
		:express.RequestHandler[]{
	return [_locals(atom_name, action), _log, _authorization,  _catch(handler)];
}

export function auth_route_middlewares(atom_name:AtomName, action: AuthAction, handler:Handler)
		:express.RequestHandler[]{
	return [_locals(atom_name, action), _log, _catch(handler)];
}

function _locals(atom_name:AtomName, action:AuthAction) {
	return (_:express.Request, res:express.Response, next:express.NextFunction) => {
		res.locals.urn = {};
		res.locals.urn.atom_name = atom_name;
		res.locals.urn.auth_action = action;
		return next();
	};
}

async function _log(req: express.Request, res:express.Response, next:express.NextFunction) {
	try {
		const urn_request = await _log_request(req, res);
		res.locals.urn.request = urn_request;
	}catch(ex){
		// TODO save on file CANNOT LOG
	}
	return next();
}

async function _authorization(req:express.Request, res:express.Response, next:express.NextFunction) {
	
	if(!res.locals.urn){
		const err_msg = 'Express response locals.urn has not been set.';
		throw urn_exc.create_invalid_request('LOCALS_NOT_SET', err_msg);
	}
	
	const atom_name = res?.locals?.urn?.atom_name;
	const auth_action = res?.locals?.urn?.auth_action;
	if(urn_core.bll.auth.is_public_request(atom_name, auth_action)){
		return next();
	}
	
	const token = req.header('x-auth-token');
	
	if(!token){
		return next();
	}
		
	try{
		
		const decoded = jwt.verify(token, web_config.jwt_private_key) as TokenObject;
		
		// urn_core.bll.auth.is_valid_token_object(decoded);
		
		res.locals.urn.token_object = decoded;
		
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
}

function _catch(handler:Handler):express.RequestHandler{
	
	return async (req: express.Request, res:express.Response, next:express.NextFunction) => {
		
		try{
			
			await handler(req, res, next);
			
		}catch(ex){
			
			_handle_exception(ex, res);
			
		}
			
	};
}

async function _log_request(req:express.Request, res:express.Response)
		:Promise<AtomShape<'request'>>{
	const atom_name = res.locals?.urn?.atom_name;
	const auth_action = res.locals?.urn?.auth_action;
	const request_shape:AtomShape<'request'> = {
		url: `${req.method.toUpperCase()}: ${req.baseUrl}${req.url}`,
		ip: req.ip,
		atom_name: atom_name,
		auth_action: auth_action
	};
	if(Object.keys(req.params).length > 0){
		request_shape.params = JSON.stringify(req.params);
	}
	if(Object.keys(req.query).length > 0){
		request_shape.query = JSON.stringify(req.query);
	}
	if(Object.keys(req.body).length > 0){
		request_shape.body = JSON.stringify(req.body);
	}
	try{
		return await bll_requests.insert_new(request_shape);
	}catch(ex){
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
		// TODO
		// Save to file CANNOT LOG
		return undefined;
	}
}
