/**
 * Express class module
 *
 * @packageDocumentation
 */

import express from 'express';

import cors from 'cors';

import {urn_log, urn_return, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init(`EXPRESSCLASS`, `Express class module`);

const urn_ret = urn_return.create(urn_log.util.return_injector);

import * as book from '../../book/';

import {register_exception_handler} from '../../util/exc_handler';

import * as conf from '../../conf/';

import {AuthName} from '../../types';

import {Service} from '../types';

import {create_express_route, create_express_auth_route} from './routes/';

type Callback = () => void;

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
class ExpressWebService implements Service {
	
	public express_app:express.Application;
	
	constructor(public service_name='main'){
		
		register_exception_handler(service_name);
		
		this.express_app = express();
		this.express_app.use(cors());
		this.express_app.use(express.json());
		this.express_app.use(express.urlencoded({extended: true}));
		this.express_app.use(function(err:any, _req:express.Request, res:express.Response, next:express.NextFunction){
			if(err.status === 400 && "body" in err) {
				const respo = urn_ret.return_error(400, 'JSON parse error', 'INVALID_JSON_REQUEST', err.message);
				res.status(respo.status).json(respo);
			}else{
				next();
			}
		});
		
		for(const atom_name of book.atom.get_names()){
			const dock_def = book.dock.get_definition(atom_name);
			const atom_def = book.atom.get_definition(atom_name);
			const router = create_express_route(atom_name);
			if(dock_def){
				if(atom_def.connection && atom_def.connection === 'log'){
					this.express_app.use(`${conf.get(`prefix_api`)}${conf.get(`prefix_log`)}${dock_def.url}`, router);
				}else{
					this.express_app.use(`${conf.get(`prefix_api`)}${dock_def.url}`, router);
				}
			}
			if(dock_def && dock_def.auth_url && typeof dock_def.auth_url === 'string'){
				const auth_route = create_express_auth_route(atom_name as AuthName);
				this.express_app.use(`${conf.get(`prefix_api`)}${dock_def.auth_url}`, auth_route);
			}
		}
	}
	
	listen(portcall:Callback): void;
	listen(portcall: number, callback:Callback): void;
	listen(portcall: number | Callback, callback?:() => void): void {
		switch(typeof portcall){
			case 'function':{
				this.express_app.listen(conf.get(`service_port`), callback);
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

