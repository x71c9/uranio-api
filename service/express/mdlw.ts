/**
 * Express default route middleware module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_return, urn_exception, urn_log} from 'urn-lib';

const urn_ret = urn_return.create(urn_log.return_injector);

type Handler = (req:express.Request, res:express.Response, next?:express.NextFunction) => Promise<any>

export function async_catch_mdlw(handler:Handler)
		:express.RequestHandler{
	
	return async (req: express.Request, res:express.Response, next:express.NextFunction) => {
		
		try{
			
			await handler(req, res, next);
			
		}catch(ex){
			
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
			return res.status(500).json(urn_ret.return_error(500, `Internal Server Error`, ex.error_code, ex.msg));
			
		}
	};

}