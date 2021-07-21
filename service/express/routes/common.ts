/**
 * Express common route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_response} from 'urn-lib';

import {
	process_request_path,
	get_atom_name_from_atom_path,
	get_route_name,
	is_auth_request,
} from '../../../util/request';

import * as types from '../../../types';

export function express_request_to_api_request(req:express.Request)
		:types.ApiRequest{
	
	const api_request_paths = process_request_path(req.path);
	
	const atom_name = get_atom_name_from_atom_path(api_request_paths.atom_path);
	
	let method = types.RouteMethod.GET;
	switch(req.method){
		case 'POST':{
			method = types.RouteMethod.POST;
			break;
		}
		case 'DELETE':{
			method = types.RouteMethod.DELETE;
			break;
		}
	}
	
	const route_name = get_route_name(atom_name, api_request_paths.route_path, method);
	
	const is_auth = is_auth_request(atom_name, api_request_paths.atom_path);
	
	const api_request:types.ApiRequest = {
		...api_request_paths,
		route_name: route_name,
		atom_name: atom_name,
		is_auth: is_auth,
		params: req.params,
		query: req.query,
	};
	if(req.body){
		api_request.body = req.body;
	}
	if(req.headers){
		api_request.headers = req.headers;
	}
	if(req.ip){
		api_request.ip = req.ip;
	}
	return api_request;
	
}

function _set_and_remove_headers(urn_res:urn_response.General<any,any>, res:express.Response)
		:express.Response{
	if(urn_res.payload && urn_res.payload.headers){
		const headers = urn_res.payload.headers;
		for(const [name, value] of Object.entries(headers)){
			res.setHeader(name, value as any);
		}
		delete urn_res.payload.headers;
	}
	return res;
}

export function return_uranio_response_to_express(urn_res:urn_response.General<any,any>, res:express.Response)
		:express.Response{
	res = _set_and_remove_headers(urn_res, res);
	return res.status(urn_res.status).send(urn_res);
}
