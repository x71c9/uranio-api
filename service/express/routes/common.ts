/**
 * Express common route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_response, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init(`COMMONEXPRESS`, `Common express routes module.`);

// import {api_config} from '../../../conf/defaults';

import {
	process_request_path,
	get_atom_name_from_atom_path,
	get_route_name,
	is_auth_request,
	get_auth_action
} from '../../../util/request';

import * as types from '../../../types';

export function express_request_to_api_request(req:express.Request)
		:types.ApiRequest{
	
	const api_request_paths = process_request_path(req.originalUrl);
	
	const atom_name = get_atom_name_from_atom_path(api_request_paths.atom_path);
	
	let method = types.RouteMethod.GET;
	switch(req.method.toUpperCase()){
		case 'GET':{
			method = types.RouteMethod.GET;
			break;
		}
		case 'POST':{
			method = types.RouteMethod.POST;
			break;
		}
		case 'DELETE':{
			method = types.RouteMethod.DELETE;
			break;
		}
		default:{
			throw urn_exc.create(`INVALID_HTTP_METHOD`, `Invalid http method [${req.method}]`);
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
		method: method,
		auth_action: get_auth_action(atom_name, route_name)
	};
	if(req.body){
		api_request.body = req.body;
	}
	if(req.headers){
		const headers:types.ApiRequestHeaders = {};
		for(const [name, value] of Object.entries(req.headers)){
			headers[name] = (Array.isArray(value)) ? JSON.stringify(value) : value;
		}
		api_request.headers = headers;
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
