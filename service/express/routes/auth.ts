/**
 * Express Authentication route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_log} from 'urn-lib';

import urn_core from 'uranio-core';

import * as types from '../../../types';

import {auth_route_middleware} from '../../../mdlw/';

import {validate_request, api_handle_and_store_exception} from '../../../util/request';

import {express_request_to_partial_api_request, return_uranio_response_to_express} from './common';

export function create_express_auth_route<A extends types.AuthName>(atom_name:A, log_blls:types.LogBlls)
		:express.Router{
	
	urn_log.fn_debug(`Create Express Auth Atom Router [${atom_name}]`);
	
	const router = express.Router();
	
	const auth_bll = urn_core.bll.auth.create(atom_name);
	
	const handler = async (route_request:types.ApiRequest) => {
		const token = await auth_bll.authenticate(
			route_request.body.email,
			route_request.body.password
		);
		return token;
	};
	router.post('/', _return_express_auth_middleware(log_blls, handler));
	return router;
	
}

function _return_express_auth_middleware(
	log_blls: types.LogBlls,
	handler: types.AuthHandler
){
	return async (
		req: express.Request,
		res: express.Response,
		_next: express.NextFunction
	) => {
		
		const partial_api_request = express_request_to_partial_api_request(req);
		try{
			const api_request = validate_request(partial_api_request);
			const urn_res = await auth_route_middleware(api_request, log_blls, handler);
			return return_uranio_response_to_express(urn_res, res);
		}catch(ex){
			const urn_err = await api_handle_and_store_exception(ex, partial_api_request, log_blls.err);
			return return_uranio_response_to_express(urn_err, res);
		}
		
	};
}
