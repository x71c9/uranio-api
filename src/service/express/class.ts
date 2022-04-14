/**
 * Express class module
 *
 * @packageDocumentation
 */

import express from 'express';

import fileupload from 'express-fileupload';

import cors from 'cors';

import {urn_log, urn_return, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init(`EXPRESSCLASS`, `Express class module`);

const urn_ret = urn_return.create(urn_log.util.return_injector);

import * as book from '../../book/server';

import {register_exception_handler} from '../../util/exc_handler';

import * as conf from '../../conf/server';

import {schema} from '../../sch/server';

import {Service} from '../types';

import {create_express_route, create_express_auth_route} from './routes/index';

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
		this.express_app.use(fileupload());
		this.express_app.use(
			function(
				err:any,
				_req:express.Request,
				res:express.Response,
				next:express.NextFunction
			){
				if(err.status === 400 && "body" in err) {
					const respo = urn_ret.return_error(
						400,
						'JSON parse error',
						'INVALID_JSON_REQUEST',
						err.message
					);
					res.status(respo.status).json(respo);
				}else{
					next();
				}
			}
		);
		const conf_prefix_api = conf.get('prefix_api');
		const conf_prefix_log = conf.get('prefix_log');
		for(const [atom_name, atom_def] of Object.entries(book.get_all_definitions())){
			
			const dock_def = atom_def.dock;
			const dock_url = book.get_dock_url(atom_name as schema.AtomName);
			const router = create_express_route(atom_name as schema.AtomName);
			const prefix_api = (conf_prefix_api[0] !== '/') ? `/${conf_prefix_api}` : conf_prefix_api;
			let prefix_log = '';
			if(atom_def.connection && atom_def.connection === 'log'){
				prefix_log = (conf_prefix_log[0]!=='/') ? `/${conf_prefix_log}` : conf_prefix_log;
			}
			const full_url = `${prefix_api}${prefix_log}${dock_url}`;
			urn_log.fn_debug(`Creating Express route [${full_url}]`);
			this.express_app.use(full_url, router);
			
			if(dock_def && dock_def.auth_url && typeof dock_def.auth_url === 'string'){
				const auth_route = create_express_auth_route(atom_name as schema.AuthName);
				const full_auth_url = `${prefix_api}${dock_def.auth_url}`;
				urn_log.fn_debug(`Creating Express auth route [${full_auth_url}]`);
				this.express_app.use(full_auth_url, auth_route);
			}
			
		}
	}
	
	listen(portcall?:Callback): void;
	listen(portcall?: number, callback?:Callback): void;
	listen(portcall?: number | Callback, callback?:() => void): void {
		let service_port = 7777;
		const current_port = conf.get(`service_port`);
		if(typeof current_port === 'number'){
			service_port = current_port;
		}
		const uranio_callback = function (){
			urn_log.debug(`Uranio service is listening on port ${service_port}...`);
			if(typeof portcall === 'function'){
				portcall();
			}else if(typeof callback === 'function'){
				callback();
			}
		};
		switch(typeof portcall){
			case 'undefined':
			case 'function':{
				this.express_app.listen(service_port, uranio_callback);
				break;
			}
			case 'number':{
				this.express_app.listen(portcall, uranio_callback);
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

