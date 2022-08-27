/**
 * Express default route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_log} from 'urn-lib';

import * as book from '../../../book/server';

import * as types from '../../../srv/types';

import {schema} from '../../../sch/server';

// import {return_default_routes} from '../../../routes/server';

import {route_middleware} from '../../../mdlw/server';

import {validate_request, api_handle_and_store_exception} from '../../../util/request';

import {express_request_to_partial_api_request, return_uranio_response_to_express} from './common';

export function create_express_route<A extends schema.AtomName>(atom_name:A)
		:express.Router{
	
	urn_log.trace(`Create Express Default Atom Router [${atom_name}]`);
	
	const router = express.Router();
	
	const routes_definition = book.get_routes_definition(atom_name);
	
	for(const [_route_name, route_definition] of Object.entries(routes_definition)){
		const route_def = route_definition as
			types.Book.Definition.Dock.Routes.Route<A, schema.RouteName<A>>;
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

