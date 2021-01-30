/**
 * Express module
 *
 * @packageDocumentation
 */

import express from 'express';

import cors from 'cors';

import {Service} from '../types';

import {users_route} from './users';

import {auth_route} from './auth';

const express_app = express();

express_app.use(cors());

express_app.use(express.json());

express_app.use(express.urlencoded({extended: true}));

// import {urn_web_config} from '../web.config';

export class ExpressWebService implements Service {
	
	constructor(){
		express_app.use('/users', users_route);
		express_app.use('/auth', auth_route);
		
		// for(const [atom_name, atom_definition] of Object.entries(urn_web_config.atoms)){
		//   const atom_route_instance = create_atom_route(atom_name, atom_definition)
		//   express_app.use(atom_definition.url, atom_route_instance.atom_route)
		// }
	}
	
	public listen(ws_port:number, callback:() => void):void{
		express_app.listen(ws_port, callback);
	}
}

