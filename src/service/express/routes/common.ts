/**
 * Express common route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {UploadedFile} from 'express-fileupload';

import {urn_response} from 'urn-lib';

import core from 'uranio-core';

import {
	process_request_path,
	get_atom_name_from_atom_path,
	get_route_name,
	is_auth_request,
	get_auth_action,
} from '../../../util/request';

import * as types from '../../../srv/types';

import {schema} from '../../../sch/server';

export function express_request_to_partial_api_request<
	A extends schema.AtomName,
	R extends schema.RouteName<A>,
	D extends schema.Depth
	>(req:express.Request):Partial<types.Api.Request<A,R,D>>{
	
	let api_request:Partial<types.Api.Request<any,any,any>> = {
		full_path: req.originalUrl,
		params: req.params as any,
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
	
	const route_name = get_route_name(
		atom_name,
		api_request_paths.route_path,
		api_request.method
	);
	
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
	
	if(is_auth){
		api_request.auth_action = core.types.AuthAction.READ;
		api_request.route_name = 'auth';
	}
	
	if(req.body){
		api_request.body = req.body;
	}
	
	if(req.files && typeof req.files.file === 'object'){
		const req_file = req.files.file as UploadedFile;
		api_request.file = {
			name: req_file.name,
			data: req_file.data,
			size: req_file.size,
			mime_type: req_file.mimetype
		};
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
	if(urn_res.payload && urn_res.payload.multi_value_headers){
		const multi_value_headers = urn_res.payload.multi_value_headers;
		for(const [name, value] of Object.entries(multi_value_headers)){
			res.setHeader(name, value as any);
		}
		delete urn_res.payload.multi_value_headers;
	}
	return res;
}

export function return_uranio_response_to_express(urn_res:urn_response.General<any,any>, res:express.Response)
		:express.Response{
	res = _set_and_remove_headers(urn_res, res);
	return res.status(urn_res.status).send(urn_res);
}

