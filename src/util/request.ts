/**
 * Module for handling request path
 *
 * @packageDocumentation
 */

import {urn_util, urn_response, urn_return, urn_log, urn_exception} from 'urn-lib';

const urn_ret = urn_return.create(urn_log.util.return_injector);

const urn_exc = urn_exception.init(`REQUEST`, `Util request module`);

import core from 'uranio-core';

import * as conf from '../conf/server';

// import {return_default_routes} from '../routes/index';

import * as insta from '../nst/server';

import * as book from '../book/server';

import {schema} from '../sch/server';

import * as types from '../srv/types';

export function process_request_path(full_path:string)
		:types.Api.Request.Paths{
	let api_request_paths:types.Api.Request.Paths = {
		full_path,
		route_path: '',
		atom_path: '',
		connection_path: ''
	};
	if(full_path.indexOf(conf.get(`prefix_api`)) !== 0){
		// throw urn_exc.create_invalid_request(`INVALID_PATH_WRONG_PREFIX`, `Invalid path. Invalid prefix.`);
		return api_request_paths;
	}
	const splitted_prefixed = full_path.split(conf.get(`prefix_api`)); // ['', '/products/3294080234']
	if(splitted_prefixed.length < 2){
		// throw urn_exc.create_invalid_request(`INVALID_EMPTY_PATH`, `Invalid path. Path is empty.`);
		return api_request_paths;
	}
	const no_prefix_path = splitted_prefixed[1]; // ['/products/0843092840']
	let splitted_no_prefix = no_prefix_path.split('/').slice(1); // ['products', '33247829374']
	let connection_path = '';
	if('/' + splitted_no_prefix[0] === conf.get(`prefix_log`)){
		connection_path = '/' + splitted_no_prefix[0]; // log
		splitted_no_prefix = splitted_no_prefix.slice(1); // ['requests', '3924809234']
	}
	const atom_path = '/' + splitted_no_prefix[0]; // /products
	if(splitted_no_prefix.length < 2){
		splitted_no_prefix.push('');
	}
	const route_sliced_path = splitted_no_prefix.slice(1); // ['2972982729']
	let route_last = route_sliced_path[route_sliced_path.length - 1]; // ['2389478932?filter=abc']
	if(route_last.includes('?')){
		const splitted_last = route_last.split('?');
		route_last = splitted_last[0]; // ['33298729483']
	}
	let route_path = '';
	if(route_sliced_path.length === 1){
		route_path = `/${route_last}`;
	}else if(route_sliced_path.length > 1){
		route_sliced_path.splice(-1);
		route_path = `/${route_sliced_path.join('/')}/${route_last}`;
	}
	if(route_path !== '/'){
		route_path += '/';
	}
	api_request_paths = {
		full_path,
		route_path,
		atom_path,
		connection_path
	};
	return api_request_paths;
}

export function get_auth_action<A extends schema.AtomName>(
	atom_name:A,
	route_name:keyof types.Book.Definition.Dock.Routes<A>
):core.types.AuthAction{
	const routes_def = book.get_routes_definition_with_defaults(atom_name);
	const route_def = routes_def[route_name];
	if(!route_def || !route_def.action){
		throw urn_exc.create(`AUTHACTION_INVALID_ROUTE_NAME`, `Invalid route name \`${String(route_name)}\` from atom \`${atom_name}\`.`);
	}
	const auth_action = route_def.action;
	if(!(auth_action in core.types.AuthAction)){
		throw urn_exc.create(`INVALID_AUTH_ACTION`, `Invalid auth action \`${auth_action}\` for \`${auth_action}\`\`${String(route_name)}\`.`);
	}
	return auth_action;
}

export function get_atom_name_from_atom_path(atom_path:string)
		:schema.AtomName | undefined{
	for(const atom_name of book.get_names()){
		const dock_def = book.get_dock_definition(atom_name);
		if(!dock_def || !dock_def.url){
			throw urn_exc.create(`INVALID_DOCK_DEF`, `Invalid dock definition for \`${atom_name}\``);
		}
		if(dock_def.url && dock_def.url === atom_path){
			return atom_name;
		}
		if(dock_def.auth_url === atom_path){
			return atom_name;
		}
	}
	return undefined;
}

export function get_route_name<A extends schema.AtomName, R extends schema.RouteName<A>>(
	atom_name:A,
	route_path:string,
	http_method:types.RouteMethod
):R | undefined{
	const routes_def = book.get_routes_definition_with_defaults(atom_name);
	/**
	 * Never rely on Object properties order.
	 * This caused issue while checking route_name.
	 * So in order to be sure is the correct route_name, first check for
	 * all exact matches, then for route with parameters.
	 */
	for(const [route_name, route_def] of Object.entries(routes_def)){
		if(route_def.method === http_method){
			if(route_def.url === route_path || route_def.url + '/' === route_path){
				return route_name as R;
			}
		}
	}
	for(const [route_name, route_def] of Object.entries(routes_def)){
		if(route_def.method === http_method){
			if(route_def.url.includes(':')){
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
					return undefined;
				}
				return route_name as R;
			}
		}
	}
	return undefined;
}

export function is_auth_request(atom_name: schema.AtomName, atom_path: string)
		:boolean{
	// const dock_def = book.dock.get_definition(atom_name);
	const dock_def = book.get_dock_definition(atom_name);
	if(dock_def && dock_def.auth_url && dock_def.auth_url === atom_path){
		return true;
	}
	return false;
}

export function get_params_from_route_path<A extends schema.AtomName, R extends schema.RouteName<A>>(
	atom_name: A,
	route_name: R,
	route_path: string
):types.Api.Request.Params<A,R>{
	const dock_def = book.get_dock_definition(atom_name);
	if(!dock_def || !dock_def.routes){
		return {} as types.Api.Request.Params<A,R>;
	}
	const routes = dock_def.routes;
	for(const route_key in routes){
		if(route_key === route_name){
			const params = {} as types.Api.Request.Params<A,R>;
			let atom_route_url = (routes as any)[route_key].url;
			if(atom_route_url[atom_route_url.length - 1] !== '/'){
				atom_route_url += '/';
			}
			const atom_route_splitted = atom_route_url.split('/');
			const splitted_route_path = route_path.split('/');
			if(atom_route_splitted.length !== splitted_route_path.length){
				// throw urn_exc.create_invalid_request(
				//   `INVALID_PATH_WRONG_FORMAT`,
				//   `Invalid path. Format wrong for atom \`${atom_name}\` route \`${route_name}\``
				// );
				return {} as types.Api.Request.Params<A,R>;
			}
			for(let i = 0; i < atom_route_splitted.length; i++){
				const split = atom_route_splitted[i];
				if(split[0] === ':'){
					const param_name = split.substr(1,split.length);
					const param_value = splitted_route_path[i];
					params[param_name as types.RouteParam<A,R>] = param_value;
				}
			}
			return params;
		}
	}
	// throw urn_exc.create_invalid_request(
	//   `INVALID_ROUTE_ATOM_NAME`,
	//   `Invalid route or atom name.`
	// );
	return {} as types.Api.Request.Params<A,R>;
}

// function _get_atom_dock(atom_name:schema.AtomName){
//   const default_routes = return_default_routes(atom_name);
//   const cloned_atom_dock = {
//     ...book.dock.get_definition(atom_name)
//   };
//   if(!cloned_atom_dock.routes){
//     cloned_atom_dock.routes = default_routes;
//   }else{
//     cloned_atom_dock.routes = {
//       ...cloned_atom_dock.routes,
//       ...default_routes
//     };
//   }
//   return cloned_atom_dock;
// }

export function store_error(
	urn_res: urn_response.Fail,
	atom_request: Partial<schema.Atom<'request'>>,
	ex?: urn_exception.ExceptionInstance,
):void{
	const error_log:schema.AtomShape<'error'> = {
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
	const bll_errs = insta.get_bll_error();
	bll_errs.insert_new(error_log).catch((ex) => {
		// ****
		// TODO Save to file CANNOT LOG
		// ****
		console.error('CANNOT STORE ERROR', ex);
		return undefined;
	});
}

export function api_handle_exception<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth>(
	ex: urn_exception.ExceptionInstance,
	partial_api_request: Partial<types.Api.Request<A,R,D>>
):urn_response.Fail<any>{
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
		case urn_exception.ExceptionType.INVALID_ATOM:
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
	if(partial_api_request.file){
		delete (partial_api_request.file as any).data;
	}
	const urn_res = urn_ret.return_error(
		status,
		msg,
		error_code,
		error_msg,
		{request: partial_api_request}
	);
	return urn_res;
}

export function api_handle_and_store_exception<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth>(
	ex: urn_exception.ExceptionInstance,
	partial_api_request: Partial<types.Api.Request<A,R,D>>,
):urn_response.Fail<any>{
	const urn_res = api_handle_exception(ex, partial_api_request);
	const atom_request = partial_api_request_to_atom_request(partial_api_request);
	store_error(urn_res, atom_request, ex);
	return _clean_response(urn_res);
}

export function partial_api_request_to_atom_request<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth>(
	partial_api_request:Partial<types.Api.Request<A,R,D>>
):schema.AtomShape<'request'>{
	const request_shape:schema.AtomShape<'request'> = {
		full_path: partial_api_request.full_path || 'NOFULLPATH',
		route_path: partial_api_request.route_path,
		atom_path: partial_api_request.atom_path,
		connection_path: partial_api_request.connection_path,
		method: partial_api_request.method,
		atom_name: partial_api_request.atom_name,
		route_name: partial_api_request.route_name as string,
		auth_action: partial_api_request.auth_action,
	};
	if(partial_api_request.is_auth === true){
		request_shape.is_auth = partial_api_request.is_auth;
	}
	if(partial_api_request.ip){
		request_shape.ip = partial_api_request.ip;
	}
	if(partial_api_request.file){
		request_shape.file = partial_api_request.file.name + ` [${partial_api_request.file.mime_type}] [${partial_api_request.file.size}]`;
	}
	if(partial_api_request.params && Object.keys(partial_api_request.params).length > 0){
		request_shape.params = urn_util.json.safe_stringify(partial_api_request.params);
	}
	if(partial_api_request.query && Object.keys(partial_api_request.query).length > 0){
		request_shape.query = urn_util.json.safe_stringify(partial_api_request.query);
	}
	if(partial_api_request.body && Object.keys(partial_api_request.body).length > 0){
		request_shape.body = urn_util.json.safe_stringify(partial_api_request.body);
	}
	return request_shape;
}

export function validate_request<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth>(
	api_request:Partial<types.Api.Request<A,R,D>>
):types.Api.Request<A,R,D>{
	if(typeof api_request.full_path !== 'string' || api_request.full_path === ''){
		throw urn_exc.create_invalid_request(
			`INVALID_PATH_FULL_PATH`,
			`Invalid path. \`full_path\` \`${api_request.full_path}\`.
		`);
	}
	if(typeof api_request.route_path !== 'string' || api_request.route_path === ''){
		throw urn_exc.create_invalid_request(
			`INVALID_PATH_ROUTE_PATH`,
			`Invalid path. \`route_path\` \`${api_request.full_path}\`.`
		);
	}
	if(typeof api_request.atom_path !== 'string' || api_request.atom_path === ''){
		throw urn_exc.create_invalid_request(
			`INVALID_PATH_ATOM_PATH`,
			`Invalid path. \`atom_path\` \`${api_request.full_path}\`.`);
	}
	if(typeof api_request.connection_path !== 'string'){
		throw urn_exc.create_invalid_request(
			`INVALID_PATH_CONN_PATH`,
			`Invalid path. \`connection_path\` \`${api_request.full_path}\`.`
		);
	}
	if(typeof api_request.method !== 'string' || api_request.method as string === ''){
		throw urn_exc.create_invalid_request(
			`INVALID_METHOD`,
			`Invalid method. \`${api_request.method}\`.`
		);
	}
	if(typeof api_request.atom_name !== 'string' || api_request.atom_name as string === ''){
		throw urn_exc.create_invalid_request(
			`INVALID_ATOM_NAME`,
			`Invalid atom name. Full path \`${api_request.full_path}\`.`
		);
	}
	if(typeof api_request.route_name !== 'string' || api_request.route_name === ''){
		throw urn_exc.create_invalid_request(
			`INVALID_ROUTE_NAME`,
			`Invalid route name. Full path \`${api_request.full_path}\`.`
		);
	}
	if(typeof api_request.is_auth !== 'boolean'){
		throw urn_exc.create_invalid_request(
			`INVALID_IS_AUTH`,
			`Invalid is_auth.`
		);
	}
	if(typeof api_request.auth_action !== 'string' || api_request.auth_action as string === ''){
		throw urn_exc.create_invalid_request(
			`INVALID_AUTH_ACTION`,
			`Invalid auth action. \`${api_request.auth_action}\`.`
		);
	}
	return api_request as types.Api.Request<A,R,D>;
}

function _clean_response(urn_res:urn_response.Fail<any>)
		:urn_response.Fail<any>{
	const cookies = urn_res.payload?.request?.headers?.cookie;
	if(cookies){
		const new_cookies:string[] = [];
		const splitted_cookies = cookies.split(';');
		for(let cookie of splitted_cookies){
			const splitted_cookie = cookie.split('=');
			if(splitted_cookie[0] === 'urn-auth-token'){
				cookie = `urn-auth-token=${splitted_cookie[1].substring(0, 32)}...`;
			}
			new_cookies.push(cookie);
		}
		urn_res.payload.request.headers.cookie = new_cookies.join('; ');
	}
	return urn_res;
}


