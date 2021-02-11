/**
 * Express default route middleware module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_return, urn_exception, urn_log} from 'urn-lib';

const urn_ret = urn_return.create(urn_log.return_injector);

import urn_core from 'urn_core';

import {Atom, AtomShape} from '../../types';

const bll_requests = urn_core.bll.create_log('request');
const bll_errors = urn_core.bll.create_log('error');

type Handler = (req:express.Request, res:express.Response, next?:express.NextFunction) => Promise<any>

export function async_catch_mdlw(handler:Handler)
		:express.RequestHandler{
	
	return async (req: express.Request, res:express.Response, next:express.NextFunction) => {
		
		const request = await _log_request(req);
		
		try{
			
			await handler(req, res, next);
			
		}catch(ex){
			
			_handle_exception(ex, res, request._id);
			
		}
			
	};
}

async function _log_request(req:express.Request)
		:Promise<Atom<'request'>>{
	const request_shape:AtomShape<'request'> = {
		url: `${req.method.toUpperCase()}: ${req.baseUrl}${req.url}`,
		ip: req.ip
	};
	if(Object.keys(req.params).length > 0)
		request_shape.params = JSON.stringify(req.params);
	if(Object.keys(req.query).length > 0)
		request_shape.query = JSON.stringify(req.query);
	if(Object.keys(req.body).length > 0)
		request_shape.body = JSON.stringify(req.body);
	
	try{
		
		return await bll_requests.insert_new(request_shape);
		
	}catch(ex){
		// TODO
		// Save on file CANNOT LOG
		return request_shape as Atom<'request'>;
	}
}

async function _handle_exception(
	ex:urn_exception.ExceptionInstance,
	res:express.Response,
	request_id:string
){
	
	let status = 500;
	let msg = 'Internal Server Error';
	let error_code = '500';
	let error_msg = ex.message;
	
	if(ex.type){
		error_code = ex.module_code + '_' + ex.error_code;
		error_msg = ex.module_name + '. ' + ex.msg;
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
			break;
		}
		case urn_exception.ExceptionType.INVALID_REQUEST:{
			status = 400;
			msg = 'Invalid Request';
			break;
		}
	}
	
	try{
		
		const error_log:AtomShape<'error'> = {
			status,
			msg,
			error_code,
			error_msg
		};
		if(request_id){
			error_log.request = request_id;
		}
		if(!ex.type){
			error_log.stack = ex.stack;
		}
		
		await bll_errors.insert_new(error_log);
		
	}catch(ex){
		// TODO
		// Save to file CANNOT LOG
	}
	const urn_res = urn_ret.return_error(status, msg, error_code, error_msg);
	return res.status(status).json(urn_res);
	
}


