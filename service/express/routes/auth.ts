/**
 * Express Authentication route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_log, urn_return, urn_exception, urn_response} from 'urn-lib';

const urn_ret = urn_return.create(urn_log.return_injector);

import urn_core from 'urn_core';

import {Atom, AtomShape} from '../../../types';

import {log_and_catch_middleware} from '../mdlw';

const bll_errors = urn_core.bll.create_log('error');

import * as req_validator from './validate';

const auth_bll = urn_core.bll.create_auth();

const router = express.Router();

router.post('/', log_and_catch_middleware(async (req:express.Request, res:express.Response) => {
	
	req_validator.empty(req.params, 'params');
	req_validator.empty(req.query, 'query');
	
	try {
		
		const token = await auth_bll.authenticate(req.body.email, req.body.password);
		return res.header('x-auth-token', token).status(200).send({});
		
	}catch(ex){
		
		switch(ex.type){
			case urn_exception.ExceptionType.NOT_FOUND:{
				const urn_res = urn_ret.return_error(
					404,
					'Not found',
					'USER_NOT_FOUND',
					'User not found.'
				);
				await _store_error(urn_res, res);
				return res.status(404).send(urn_res);
			}
			case urn_exception.ExceptionType.INVALID_REQUEST:{
				if(ex.error_code === 'AUTH_INVALID_PASSWORD'){
					const urn_res = urn_ret.return_error(
						400,
						'Invalid request',
						'AUTH_INVALID_PASSWORD',
						`User and password don't match.`
					);
					await _store_error(urn_res, res);
					return res.status(400).send(urn_res);
				}else{
					throw ex;
				}
			}
		}
		throw ex;
		
	}
	
}));

async function _store_error(urn_res:urn_response.Fail, res:express.Response)
		:Promise<Atom<'error'> | undefined>{
	try{
		const error_log:AtomShape<'error'> = {
			status: urn_res.status,
			msg: '' + urn_res.message,
			error_code: urn_res.err_code,
			error_msg: urn_res.err_msg,
		};
		if(res.locals.urn_request){
			error_log.request = res.locals.urn_request._id;
		}
		return await bll_errors.insert_new(error_log);
	}catch(ex){
		// TODO
		// Save to file CANNOT LOG
		return undefined;
	}
}


export {
	router as auth_route
};
