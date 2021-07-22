/**
 * Module for handling request path
 *
 * @packageDocumentation
 */

import {urn_response, urn_return, urn_log, urn_exception} from 'urn-lib';

import urn_core from 'uranio-core';

import {api_book} from 'uranio-books/api';

import {api_config} from '../conf/defaults';

import {return_default_routes} from '../routes/';

const urn_ret = urn_return.create(urn_log.util.return_injector);

const urn_exc = urn_exception.init(`UTILREQUEST`, `Util request module`);

import * as types from '../types';

export function process_request_path(path:string)
		:types.ApiRequestPaths{
	const full_path = path;
	if(full_path.indexOf(api_config.prefix_api) !== 0){
		throw urn_exc.create_invalid_request(`INVALID_PATH_WRONG_PREFIX`, `Invalid path. Invalid prefix.`);
	}
	const splitted_prefixed = full_path.split(api_config.prefix_api);
	if(splitted_prefixed.length < 2){
		throw urn_exc.create_invalid_request(`INVALID_EMPTY_PATH`, `Invalid path. Path is empty.`);
	}
	const no_prefix_path = splitted_prefixed[1];
	let splitted_no_prefix = no_prefix_path.split('/');
	let connection_path = '';
	if(splitted_no_prefix[0] === api_config.prefix_log){
		connection_path = '/' + splitted_no_prefix[0];
		splitted_no_prefix = splitted_no_prefix.slice(1);
	}
	const atom_path = '/' + splitted_no_prefix[0];
	const route_path = '/' + splitted_no_prefix.slice(1).join('/') + '/';
	
	const api_request_paths = {
		full_path,
		route_path,
		atom_path,
		connection_path
	};
	return api_request_paths;
}

export function get_auth_action(atom_name:types.AtomName, route_name:keyof types.Book.Definition.Api.Routes)
		:types.AuthAction{
	const atom_api = _get_atom_api(atom_name);
	if(!atom_api.routes || !atom_api.routes[route_name]){
		throw urn_exc.create(`AUTHACTION_INVALID_ROUTE_NAME`, `Invalid route name [${route_name}] from atom [${atom_name}].`);
	}
	const auth_action = atom_api.routes[route_name].action;
	if(!(auth_action in types.AuthAction)){
		throw urn_exc.create(`INVALID_AUTH_ACTION`, `Invalid auth action [${auth_action}] for [${auth_action}][${route_name}].`);
	}
	return auth_action;
}

export function get_atom_name_from_atom_path(atom_path:string)
		:types.AtomName{
	let atom_name:keyof typeof api_book;
	for(atom_name in api_book){
		const api_def = api_book[atom_name] as types.Book.Definition<typeof atom_name>;
		if(api_def.api && api_def.api.url && api_def.api.url === atom_path){
			return atom_name;
		}
	}
	throw urn_exc.create(`INVALID_API_URL`, `Invalid api url.`);
}

export function get_route_name<A extends types.AtomName>(atom_name:A, route_path:string, http_method:types.RouteMethod)
		:string{
	const atom_api = _get_atom_api(atom_name);
	if(!atom_api.routes){
		throw urn_exc.create(`INVALID_API_DEF`, `Invalid api_def. Missing "routes" property.`);
	}
	for(const route_name in atom_api.routes){
		const route_def = atom_api.routes[route_name];
		if(route_def.method === http_method){
			if(route_def.url === route_path){
				return route_name;
			}else if(route_def.url.includes(':')){
				// if(route_path[route_path.length - 1] !== '/'){
				//   route_path += '/';
				// }
				if(route_def.url[route_def.url.length - 1] !== '/'){
					route_def.url += '/';
				}
				const splitted_route_def_url = route_def.url.split('/');
				const splitted_route_url = route_path.split('/');
				if(splitted_route_def_url.length !== splitted_route_url.length){
					continue;
				}
				for(let i = 0; i < splitted_route_def_url.length; i++){
					const url_part = splitted_route_def_url[i];
					if(url_part[0] === ':' || url_part === splitted_route_url[i]){
						continue;
					}
					throw urn_exc.create_invalid_request(
						`IVALID_ROUTE_PATH`,
						`Invalid route path.`
					);
				}
				return route_name;
			}
		}
	}
	throw urn_exc.create_invalid_request(
		`INVALID_PATH_ROUTE_NOT_FOUND`,
		`Invalid path. Route not found or invalid.`
	);
}

export function is_auth_request(atom_name: types.AtomName, atom_path: string)
		:boolean{
	const atom_api = api_book[atom_name]['api'] as types.Book.Definition.Api;
	if(atom_api.auth && atom_api.auth === atom_path){
		return true;
	}
	return false;
}

export function get_params_from_route_path(
	atom_name: types.AtomName,
	route_name: keyof types.Book.Definition.Api.Routes,
	route_path: string
):types.ApiRequestParams{
	const atom_api = _get_atom_api(atom_name);
	for(const route_key in atom_api.routes){
		if(route_key === route_name){
			const params:types.ApiRequestParams = {};
			let atom_route_url = atom_api.routes[route_key].url;
			if(atom_route_url[atom_route_url.length - 1] !== '/'){
				atom_route_url += '/';
			}
			const atom_route_splitted = atom_route_url.split('/');
			const splitted_route_path = route_path.split('/');
			if(atom_route_splitted.length !== splitted_route_path.length){
				throw urn_exc.create_invalid_request(
					`INVALID_PATH_WRONG_FORMAT`,
					`Invalid path. Format wrong for atom [${atom_name}] route [${route_name}]`
				);
			}
			for(let i = 0; i < atom_route_splitted.length; i++){
				const split = atom_route_splitted[i];
				if(split[0] === ':'){
					const param_name = split.substr(1,split.length);
					const param_value = splitted_route_path[i];
					params[param_name] = param_value;
				}
			}
			return params;
		}
	}
	throw urn_exc.create_invalid_request(
		`INVALID_ROUTE_ATOM_NAME`,
		`Invalid route or atom name.`
	);
}

function _get_atom_api(atom_name:types.AtomName){
	const atom_api = api_book[atom_name as keyof typeof api_book].api as
		types.Book.Definition.Api;
	const default_routes = return_default_routes(atom_name);
	if(!atom_api.routes){
		atom_api.routes = default_routes;
	}else{
		atom_api.routes = {
			...default_routes,
			...atom_api.routes
		};
	}
	return atom_api;
}

export async function store_error(
	urn_res: urn_response.Fail,
	atom_request: Partial<types.Atom<'request'>>,
	bll_errs: urn_core.bll.BLL<'error'>,
	ex?: urn_exception.ExceptionInstance,
):Promise<types.Atom<'error'> | undefined>{
	try{
		const error_log:types.AtomShape<'error'> = {
			status: urn_res.status,
			msg: '' + urn_res.message,
			error_code: urn_res.err_code,
			error_msg: urn_res.err_msg,
		};
		if(atom_request._id !== undefined){
			error_log.request = atom_request._id;
		}
		if(ex && !ex.type){
			error_log.stack = ex.stack;
		}
		return await bll_errs.insert_new(error_log);
	}catch(ex){
		// ****
		// TODO Save to file CANNOT LOG
		// ****
		console.error('CANNOT STORE ERROR', ex);
		return undefined;
	}
}

export function handle_exception(ex:urn_exception.ExceptionInstance)
		:urn_response.Fail<any>{
	let status = 500;
	let msg = 'Internal Server Error';
	let error_code = '500';
	let error_msg = ex.message;
	if(ex.type){
		error_code = ex.module_code + '_' + ex.error_code;
		error_msg = ex.msg;
	}
	switch(ex.type){
		case urn_exception.ExceptionType.UNAUTHORIZED:{
			status = 401;
			msg = 'Unauthorized';
			break;
		}
		case urn_exception.ExceptionType.NOT_FOUND:{
			status = 404;
			msg = 'Not Found';
			error_code = 'RECORD_NOT_FOUND';
			error_msg = 'Record not found.';
			break;
		}
		case urn_exception.ExceptionType.INVALID_REQUEST:{
			status = 400;
			msg = 'Invalid Request';
			break;
		}
		case urn_exception.ExceptionType.AUTH_NOT_FOUND:
		case urn_exception.ExceptionType.AUTH_INVALID_PASSWORD:{
			status = 400;
			msg = 'Invalid auth request';
			error_code = 'INVALID_AUTH_REQUEST';
			error_msg = 'User or password are not valid.';
			break;
		}
	}
	const urn_res = urn_ret.return_error(
		status,
		msg,
		error_code,
		error_msg
	);
	return urn_res;
}

export async function handle_and_store_exception(
	ex: urn_exception.ExceptionInstance,
	atom_request: Partial<types.Atom<'request'>>,
	bll_errs: urn_core.bll.BLL<'error'>
):Promise<urn_response.Fail<any>>{
	const urn_res = handle_exception(ex);
	await store_error(urn_res, atom_request, bll_errs, ex);
	return urn_res;
}


