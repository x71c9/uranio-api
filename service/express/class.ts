/**
 * Express class module
 *
 * @packageDocumentation
 */

import express from 'express';

import cors from 'cors';

import {urn_log, urn_return} from 'urn-lib';

const urn_ret = urn_return.create(urn_log.return_injector);

import {atom_book} from 'urn_book';

import {AtomName, Book} from '../../types';

import {Service} from '../types';

import {
	create_route,
	// create_auth_route
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

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class ExpressWebService implements Service {
	
	constructor(){
		let atom_name:AtomName;
		for(atom_name in atom_book){
			const atom_def = atom_book[atom_name] as Book.Definition;
			const router = create_route(atom_name);
			if(atom_def.api){
				if(atom_def.connection && atom_def.connection === 'log'){
					express_app.use('/logs/'+atom_def.api.url, router);
				}else{
					express_app.use('/'+atom_def.api.url, router);
				}
			}
			// if(atom_def.api && atom_def.api.auth && typeof atom_def.api.auth === 'string'){
			//   express_app.use(atom_def.api.auth, create_auth_route(atom_name as AuthName));
			// }
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
