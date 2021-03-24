/**
 * Express class module
 *
 * @packageDocumentation
 */

import express from 'express';

import cors from 'cors';

import {urn_log, urn_return} from 'urn-lib';

const urn_ret = urn_return.create(urn_log.util.return_injector);

import {atom_book, api_book} from 'urn_books';

import {register_exception_handler} from '../../tools/exc_handler';

import {Book, AuthName} from '../../types';

import {Service} from '../types';

import {
	create_route,
	create_auth_route
} from './routes/';

const express_app = express();

express_app.use(cors());

express_app.use(express.json());

express_app.use(express.urlencoded({extended: true}));

express_app.use(function(err:any, _:express.Request, res:express.Response, next:express.NextFunction){
	
	if(err.status === 400 && "body" in err) {
		const respo = urn_ret.return_error(400, 'JSON parse error', 'INVALID_JSON_REQUEST', err.message);
		res.status(respo.status).json(respo);
	}else{
		next();
	}
	
});

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
class ExpressWebService implements Service {
	
	constructor(public service_name='main'){
		
		register_exception_handler(service_name);
		
		let atom_name:keyof typeof api_book;
		for(atom_name in api_book){
			const api_def = api_book[atom_name] as Book.BasicDefinition;
			const atom_def = atom_book[atom_name] as Book.BasicDefinition;
			const router = create_route(atom_name);
			if(api_def.api){
				if(atom_def.connection && atom_def.connection === 'log'){
					express_app.use(`/logs/${api_def.api.url}`, router);
				}else{
					express_app.use(`/${api_def.api.url}`, router);
				}
			}
			if(api_def.api && api_def.api.auth && typeof api_def.api.auth === 'string'){
				express_app.use(`/${api_def.api.auth}`, create_auth_route(atom_name as AuthName));
			}
		}
	}
	
	listen(ws_port: number, callback:() => void): void {
		express_app.listen(ws_port, callback);
	}
	
}

export function create():ExpressWebService{
	urn_log.fn_debug(`Create ExpressWebService`);
	return new ExpressWebService();
}
