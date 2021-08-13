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
	get_auth_action,
} from '../../../util/request';

import * as types from '../../../types';

export function express_request_to_partial_api_request(req:express.Request)
		:Partial<types.Api.Request>{
	
	let api_request:Partial<types.Api.Request> = {
		full_path: req.originalUrl,
		params: req.params,
		query: req.query
	};
	
	const api_request_paths = process_request_path(req.originalUrl);
	
	if(!api_request_paths.atom_path){
		return api_request;
	}
	
	api_request = {
		...api_request,
		...api_request_paths
	};
	
	const atom_name = get_atom_name_from_atom_path(api_request_paths.atom_path);
	
	if(!atom_name){
		return api_request;
	}
	
	api_request.atom_name = atom_name;
	
	switch(req.method.toUpperCase()){
		case 'GET':{
			api_request.method = types.RouteMethod.GET;
			break;
		}
		case 'POST':{
			api_request.method = types.RouteMethod.POST;
			break;
		}
		case 'DELETE':{
			api_request.method = types.RouteMethod.DELETE;
			break;
		}
		default:{
			return api_request;
		}
	}
	
	const route_name = get_route_name(atom_name, api_request_paths.route_path, api_request.method);
	
	if(!route_name){
		return api_request;
	}
	
	api_request.route_name = route_name;
	
	const is_auth = is_auth_request(atom_name, api_request_paths.atom_path);
	
	api_request.is_auth = is_auth;
	
	const auth_action = get_auth_action(atom_name, route_name);

	if(!auth_action){
		return api_request;
	}
	
	api_request.auth_action = auth_action;
	
	if(req.body){
		api_request.body = req.body;
	}
	if(req.headers){
		const headers:types.Api.Request.Headers = {};
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

