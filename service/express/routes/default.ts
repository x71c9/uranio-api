/**
 * Express default route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_log} from 'urn-lib';

import {api_book} from 'uranio-books/api';

import * as types from '../../../types';

import {return_default_routes} from '../../../routes/';

import {route_middleware} from '../../../mdlw/';

import {validate_request, handle_and_store_exception} from '../../../util/request';

import {express_request_to_partial_api_request, return_uranio_response_to_express} from './common';

export function create_express_route<A extends types.AtomName>(atom_name:A, bll_logs:types.LogBlls)
		:express.Router{
	
	urn_log.fn_debug(`Create Express Default Atom Router [${atom_name}]`);
	
	const router = express.Router();
	
	if(!api_book[atom_name]){
		return router;
	}
	
	const atom_api = api_book[atom_name].api as types.Book.Definition.Api;
	
	if(!atom_api){
		return router;
	}
	
	const default_routes = return_default_routes(atom_name);
	
	if(!atom_api.routes){
		atom_api.routes = default_routes;
	}else{
		atom_api.routes = {
			...default_routes,
			...atom_api.routes
		};
	}
	
	for(const [_route_name, route_def] of Object.entries(atom_api.routes)){
		switch(route_def.method){
			case types.RouteMethod.GET: {
				router.get(route_def.url, _return_express_middleware(bll_logs));
				break;
			}
			case types.RouteMethod.POST: {
				router.post(route_def.url, _return_express_middleware(bll_logs));
				break;
			}
			case types.RouteMethod.DELETE: {
				router.delete(route_def.url, _return_express_middleware(bll_logs));
				break;
			}
		}
	}
		
	return router;
	
}

function _return_express_middleware(log_blls:types.LogBlls){
	
	return async (
		req: express.Request,
		res: express.Response,
		_next: express.NextFunction
	) => {
		
		const partial_api_request = express_request_to_partial_api_request(req);
		try{
			const api_request = validate_request(partial_api_request);
			const urn_res = await route_middleware(api_request, log_blls);
			return return_uranio_response_to_express(urn_res, res);
		}catch(ex){
			const urn_err = await handle_and_store_exception(ex, partial_api_request, log_blls.err);
			return return_uranio_response_to_express(urn_err, res);
		}
		
	};
}

