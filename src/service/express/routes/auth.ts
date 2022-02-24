/**
 * Express Authentication route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_log} from 'urn-lib';

import core from 'uranio-core';

import * as types from '../../../server/types';

import {schema} from '../../../sch/server';

import {auth_route_middleware} from '../../../mdlw/server';

import {validate_request, api_handle_and_store_exception} from '../../../util/request';

import {express_request_to_partial_api_request, return_uranio_response_to_express} from './common';

export function create_express_auth_route<A extends schema.AuthName>(atom_name:A)
		:express.Router{
	
	urn_log.fn_debug(`Create Express Auth Atom Router [${atom_name}]`);
	
	const router = express.Router();
	
	const auth_bll = core.bll.auth.create(atom_name);
	
	const handler = async (route_request:types.Api.Request<A,any,any>) => {
		const token = await auth_bll.authenticate(
			route_request.body.email,
			route_request.body.password
		);
		return token;
	};
	router.post('/', _return_express_auth_middleware(handler));
	return router;
	
}

function _return_express_auth_middleware<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth>(handler: types.AuthHandler<A,R,D>){
	return async (
		req: express.Request,
		res: express.Response,
		_next: express.NextFunction
	) => {
		
		const partial_api_request = express_request_to_partial_api_request<A,R,D>(req);
		try{
			const api_request = validate_request<A,R,D>(partial_api_request);
			const urn_res = await auth_route_middleware<A,R,D>(api_request, handler);
			return return_uranio_response_to_express(urn_res, res);
		}catch(e){
			const ex = e as any;
			const urn_err = api_handle_and_store_exception(ex, partial_api_request);
			return return_uranio_response_to_express(urn_err, res);
		}
		
	};
}
