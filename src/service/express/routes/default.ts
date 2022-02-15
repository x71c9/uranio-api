/**
 * Express default route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init(`EXPRESS_ROUTES_DEFAULT`,`Express routes default module`);

import * as book from '../../../book/index';

import * as types from '../../../types';

import {schema} from '../../../sch/index';

import {return_default_routes} from '../../../routes/server';

import {route_middleware} from '../../../mdlw/index';

import {validate_request, api_handle_and_store_exception} from '../../../util/request';

import {express_request_to_partial_api_request, return_uranio_response_to_express} from './common';

export function create_express_route<A extends schema.AtomName>(atom_name:A)
		:express.Router{
	
	urn_log.fn_debug(`Create Express Default Atom Router [${atom_name}]`);
	
	const router = express.Router();
	
	const dock_def = book.get_definition(atom_name).dock;
	
	const default_routes = return_default_routes(atom_name);
	
	if(!dock_def){
		throw urn_exc.create_invalid_book(
			`INVALID_DOCK_DEF`,
			`Cannot create express route. Invalid dock definition.`
		);
	}
	if(!dock_def.routes){
		dock_def.routes = default_routes;
	}else{
		// custom route go before.
		dock_def.routes = {
			...dock_def.routes,
			...default_routes
		};
	}
	
	for(const [_route_name, route_def] of Object.entries(dock_def.routes)){
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
		
		const partial_api_request = express_request_to_partial_api_request(req);
		try{
			const api_request = validate_request(partial_api_request);
			const urn_res = await route_middleware(api_request);
			return return_uranio_response_to_express(urn_res, res);
		}catch(e){
			const ex = e as any;
			const urn_err = api_handle_and_store_exception(ex, partial_api_request);
			return return_uranio_response_to_express(urn_err, res);
		}
		
	};
}

