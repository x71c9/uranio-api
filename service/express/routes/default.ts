/**
 * Express default route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_log, urn_util} from 'urn-lib';

import {dock_book} from 'uranio-books/dock';

import * as types from '../../../types';

import {return_default_routes} from '../../../routes/';

import {route_middleware} from '../../../mdlw/';

import {validate_request, api_handle_and_store_exception} from '../../../util/request';

import {express_request_to_partial_api_request, return_uranio_response_to_express} from './common';

export function create_express_route<A extends types.AtomName>(atom_name:A)
		:express.Router{
	
	urn_log.fn_debug(`Create Express Default Atom Router [${atom_name}]`);
	
	const router = express.Router();
	
	if(!dock_book[atom_name]){
		return router;
	}
	
	const dock_def = dock_book[atom_name];
	
	if(!urn_util.object.has_key(dock_def, 'dock')){
		return router;
	}
	
	const atom_dock = dock_def.dock as types.Book.Definition.Dock;
	
	if(!atom_dock){
		return router;
	}
	
	const default_routes = return_default_routes(atom_name);
	
	if(!atom_dock.routes){
		atom_dock.routes = default_routes;
	}else{
		atom_dock.routes = {
			...default_routes,
			...atom_dock.routes
		};
	}
	
	for(const [_route_name, route_def] of Object.entries(atom_dock.routes)){
		switch(route_def.method){
			case types.RouteMethod.GET: {
				router.get(route_def.url, _return_express_middleware());
				break;
			}
			case types.RouteMethod.POST: {
				router.post(route_def.url, _return_express_middleware());
				break;
			}
			case types.RouteMethod.DELETE: {
				router.delete(route_def.url, _return_express_middleware());
				break;
			}
		}
	}
		
	return router;
	
}

function _return_express_middleware(){
	
	return async (
		req: express.Request,
		res: express.Response,
		_next: express.NextFunction
	) => {
		
		console.log(req);
		const partial_api_request = express_request_to_partial_api_request(req);
		try{
			const api_request = validate_request(partial_api_request);
			const urn_res = await route_middleware(api_request);
			return return_uranio_response_to_express(urn_res, res);
		}catch(ex){
			const urn_err = api_handle_and_store_exception(ex, partial_api_request);
			return return_uranio_response_to_express(urn_err, res);
		}
		
	};
}

