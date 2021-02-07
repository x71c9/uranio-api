/**
 * Express class module
 *
 * @packageDocumentation
 */

import express from 'express';

import cors from 'cors';

import {urn_log, urn_return} from 'urn-lib';

const urn_ret = urn_return.create();

import {atom_book} from 'urn_book';

import {AtomName, Book} from '../../types';

import {Service} from '../types';

import {create as create_route} from './route';

const express_app = express();

express_app.use(cors());

express_app.use(express.json());

express_app.use(express.urlencoded({extended: true}));

express_app.use(function(err:any, req:express.Request, res:express.Response, next:express.NextFunction){
	
	if(err.status === 400 && "body" in err) {
		const respo = urn_ret.return_error(400, 'JSON parse error - '+err.message, {request: req});
		res.status(respo.status).send(respo);
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
			express_app.use(atom_def.api.url, router);
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
