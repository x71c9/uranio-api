/**
 * Express default route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_log} from 'urn-lib';

import {atom_book} from 'urn_book';

import {
	AtomName,
	RouteMethod,
	Book
} from '../../../types';

import {route_middlewares} from '../mdlw';

export function create_route<A extends AtomName>(atom_name:A)
		:express.Router{
	
	urn_log.fn_debug(`Create Express Default Atom Router [${atom_name}]`);
	
	const router = express.Router();
	
	const atom_api = atom_book[atom_name].api as Book.Definition.Api;
	
	if(atom_api && atom_api.routes){
		
		// TODO load default routes
		
		for(const [route_name, route_def] of Object.entries(atom_api.routes)){
			
			switch(route_def.method){
				case RouteMethod.GET: {
					router.get(route_def.url, route_middlewares(atom_name, route_name));
					break;
				}
				case RouteMethod.POST: {
					router.post(route_def.url, route_middlewares(atom_name, route_name));
					break;
				}
				case RouteMethod.DELETE: {
					router.delete(route_def.url, route_middlewares(atom_name, route_name));
					break;
				}
			}
			
		}
		
	}
	
	return router;
	
}

