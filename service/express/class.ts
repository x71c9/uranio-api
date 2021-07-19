/**
 * Express class module
 *
 * @packageDocumentation
 */

import express from 'express';

import cors from 'cors';

import {urn_log, urn_return, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init(`EXPRESSCLASS`, `Express class module.`);

const urn_ret = urn_return.create(urn_log.util.return_injector);

import {atom_book} from 'uranio-books/atom';

import {api_book} from 'uranio-books/api';

import {register_exception_handler} from '../../tools/exc_handler';

import {api_config} from '../../conf/defaults';

import {Book, AuthName} from '../../types';

import {Service} from '../types';

import {
	create_express_route,
	create_express_auth_route
} from './routes/';

type Callback = () => void;

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
class ExpressWebService implements Service {
	
	public express_app:express.Application;
	
	constructor(public service_name='main'){
		
		this.express_app = express();
		this.express_app.use(cors());
		this.express_app.use(express.json());
		this.express_app.use(express.urlencoded({extended: true}));
		this.express_app.use(function(err:any, _:express.Request, res:express.Response, next:express.NextFunction){
			if(err.status === 400 && "body" in err) {
				const respo = urn_ret.return_error(400, 'JSON parse error', 'INVALID_JSON_REQUEST', err.message);
				res.status(respo.status).json(respo);
			}else{
				next();
			}
		});
		
		register_exception_handler(service_name);
		
		let atom_name:keyof typeof api_book;
		for(atom_name in api_book){
			const api_def = api_book[atom_name] as Book.BasicDefinition;
			const atom_def = atom_book[atom_name] as Book.BasicDefinition;
			const router = create_express_route(atom_name);
			if(api_def.api){
				if(atom_def.connection && atom_def.connection === 'log'){
					this.express_app.use(`/logs/${api_def.api.url}`, router);
				}else{
					this.express_app.use(`/${api_def.api.url}`, router);
				}
			}
			if(api_def.api && api_def.api.auth && typeof api_def.api.auth === 'string'){
				this.express_app.use(`/${api_def.api.auth}`, create_express_auth_route(atom_name as AuthName));
			}
		}
	}
	
	listen(portcall:Callback): void;
	listen(portcall: number, callback:Callback): void;
	listen(portcall: number | Callback, callback?:() => void): void {
		switch(typeof portcall){
			case 'function':{
				this.express_app.listen(api_config.service_port, callback);
				break;
			}
			case 'number':{
				this.express_app.listen(portcall, callback);
				break;
			}
			default:{
				throw urn_exc.create(`INVALID_LISTEN_ARGS`, 'Invalid arguments.');
			}
		}
	}
}

export function create():ExpressWebService{
	urn_log.fn_debug(`Create ExpressWebService`);
	return new ExpressWebService();
}

