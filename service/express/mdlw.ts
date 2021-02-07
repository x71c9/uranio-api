/**
 * Express default route middleware module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_return, urn_exception} from 'urn-lib';

const urn_ret = urn_return.create();

type Handler = (req:express.Request, res:express.Response, next?:express.NextFunction) => Promise<any>

export function async_catch_mdlw(handler:Handler)
		:express.RequestHandler{
	
	return async (req: express.Request, res:express.Response, next:express.NextFunction) => {
		
		try{
			
			await handler(req, res, next);
			
		}catch(ex){
			
			switch(ex.type){
				case urn_exception.ExceptionType.UNAUTHORIZED:{
					return res.status(401).json(urn_ret.return_error(401, `Unauthorized`, null, ex));
				}
				case urn_exception.ExceptionType.NOT_FOUND:{
					return res.status(404).json(urn_ret.return_error(404, `Not Found`, null, ex));
				}
			}
			return res.status(500).json(urn_ret.return_error(500, `Internal Server Error`, null, ex));
			
		}
	};

}
