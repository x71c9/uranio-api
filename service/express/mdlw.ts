/**
 * Express default route middleware module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_return, urn_exception, urn_log} from 'urn-lib';

const urn_ret = urn_return.create(urn_log.return_injector);

import urn_core from 'urn_core';

const db_log_debug = urn_core.bll.create_log('debug');
const db_log_error = urn_core.bll.create_log('error');

type Handler = (req:express.Request, res:express.Response, next?:express.NextFunction) => Promise<any>

export function async_catch_mdlw(handler:Handler)
		:express.RequestHandler{
	
	return async (req: express.Request, res:express.Response, next:express.NextFunction) => {
		
		try{
			
			const log = {
				active: true,
				msg: 'WebService Debug',
				type: 'debug',
				body: JSON.stringify(req.body),
				params: JSON.stringify(req.params),
				query: JSON.stringify(req.query),
				path: `${req.method}: ${req.baseUrl}${req.path}`,
				ip: req.ip
			};
			
			await db_log_debug.insert_new(log);
			
			await handler(req, res, next);
			
		}catch(ex){
			
			const log = {
				active: true,
				msg: `WebService Error [${ex.type}]`,
				type: 'error',
				body: JSON.stringify(req.body),
				params: JSON.stringify(req.params),
				query: JSON.stringify(req.query),
				path: `${req.method}: ${req.baseUrl}${req.path}`,
				ip: req.ip
			};
			
			await db_log_error.insert_new(log);
			
			switch(ex.type){
				case urn_exception.ExceptionType.UNAUTHORIZED:{
					return res.status(401).json(urn_ret.return_error(401, `Unauthorized`, ex.error_code, ex.msg));
				}
				case urn_exception.ExceptionType.NOT_FOUND:{
					return res.status(404).json(urn_ret.return_error(404, `Not Found`, ex.error_code, ex.msg));
				}
				case urn_exception.ExceptionType.INVALID_REQUEST:{
					return res.status(400).json(urn_ret.return_error(400, `Invalid Request`, ex.error_code, ex.msg));
				}
			}
			return res.status(500).json(urn_ret.return_error(500, `Internal Server Error`, '500', ex.message));
			
		}
	};

}
