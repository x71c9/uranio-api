/**
 * Express Authentication route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_log} from 'urn-lib';

import urn_core from 'uranio-core';

import * as types from '../../../types';

// import {auth_route_middlewares} from '../mdlw';

import {auth_route_middleware} from '../../../mdlw/';

import {express_request_to_raw_request, return_uranio_response_to_express} from './common';

export function create_express_auth_route<A extends types.AuthName>(atom_name:A, log_blls:types.LogBlls)
		:express.Router{
	
	urn_log.fn_debug(`Create Express Auth Atom Router [${atom_name}]`);
	
	const router = express.Router();
	
	const auth_bll = urn_core.bll.auth.create(atom_name);
	
	// router.post('/', auth_route_middlewares(atom_name, 'auth',
	//   async (route_request:RouteRequest) => {
	//     const token = await auth_bll.authenticate(
	//       route_request.body.email,
	//       route_request.body.password
	//     );
	//     return token;
	//   }
	// ));
	
	const handler = async (route_request:types.RouteRequest) => {
		const token = await auth_bll.authenticate(
			route_request.body.email,
			route_request.body.password
		);
		return token;
	};
	router.post('/', _return_express_auth_middleware(atom_name, 'auth', log_blls, handler));
	return router;
	
}

function _return_express_auth_middleware(
	atom_name: types.AuthName,
	route_name: string,
	log_blls: types.LogBlls,
	handler: types.AuthHandler
){
	return async (
		req: express.Request,
		res: express.Response,
		_next: express.NextFunction
	) => {
		
		const raw_request = express_request_to_raw_request(req);
		
		const urn_res = await auth_route_middleware(atom_name, route_name, handler, raw_request, log_blls);
		
		return return_uranio_response_to_express(urn_res, res);
	};
}
