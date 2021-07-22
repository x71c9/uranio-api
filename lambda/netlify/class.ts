/**
 * Netlify class module
 *
 * @packageDocumentation
 */

// import {urn_log, urn_return, urn_response, urn_exception} from 'urn-lib';
import {urn_log, urn_response} from 'urn-lib';

import urn_core from 'uranio-core';

// import {atom_book} from 'uranio-books/atom';

// import {api_book} from 'uranio-books/api';

// const urn_exc = urn_exception.init(`NETLIFYLAMBDACLASS`, `Netlify lambda class module.`);

// const urn_ret = urn_return.create(urn_log.util.return_injector);

// import {api_config} from '../../conf/defaults';

import {
	process_request_path,
	get_atom_name_from_atom_path,
	get_route_name,
	is_auth_request,
	get_params_from_route_path,
	get_auth_action,
	// handle_exception
} from '../../util/request';

// import {return_default_routes} from '../../routes/';

import {route_middleware, auth_route_middleware} from '../../mdlw/';

import * as types from '../../types';

import {
	Lambda,
	LambdaEvent,
	LambdaContext,
	HandlerResponse,
	LambdaHeaders,
	LambdaMultiValueHeaders
} from '../types';

@urn_log.util.decorators.debug_constructor
@urn_log.util.decorators.debug_methods
class NetlifyLambda implements Lambda {
	
	public bll_requests:urn_core.bll.BLL<'request'>;
	public bll_errors:urn_core.bll.BLL<'error'>;
	
	constructor(){
		this.bll_requests = urn_core.bll.log.create('request');
		this.bll_errors = urn_core.bll.log.create('error');
	}
	
	public async handle(event:LambdaEvent, context:LambdaContext)
			:Promise<HandlerResponse> {
		const urn_res = await this.lambda_route(event, context);
		return _return_handler_response(urn_res);
	}
	
	public async lambda_route(event:LambdaEvent, context:LambdaContext){
		const api_request = _lambda_request_to_api_request(event, context);
		const log_blls = {
			req: this.bll_requests,
			err: this.bll_errors
		};
		if(api_request.is_auth){
			// ****
			// TODO CHECK - Maybe this can be a bad idea - to create the BLL on request
			// instead of passing only one reference. But it must be for each auth atom.
			// We do it anyway a bll for each call depending on the `path`.
			// ****
			const auth_bll = urn_core.bll.auth.create(api_request.atom_name as types.AuthName);
			const auth_handler = async (api_request:types.ApiRequest) => {
				const token = await auth_bll.authenticate(
					api_request.body.email,
					api_request.body.password
				);
				return token;
			};
			return auth_route_middleware(api_request, log_blls, auth_handler);
		}else{
			return route_middleware(api_request, log_blls);
		}
	}
	
}

// function _validate_log_path(path:string, atom_name:types.AtomName){
//   const atom_def = atom_book[atom_name] as types.Book.Definition<typeof atom_name>;
//   const splitted_path = path.split('/uranio/api/');
//   const url = splitted_path[1];
//   const splitted_url = url.split('/');
//   if(atom_def.connection && atom_def.connection === 'log' && splitted_url[0] !== 'logs'){
//     throw urn_exc.create_invalid_request(`INVALID_PATH_LOG_ATOM`, `Invalid path for log atom [${atom_name}].`);
//   }
// }

// function _validate_path(path:string){
//   if(!path.includes('/uranio/api/')){
//     throw urn_exc.create_invalid_request(
//       `INVALID_PATH_WRONG_PREFIX`,
//       `Invalid path. Invalid prefix.`
//     );
//   }
//   const splitted_path = path.split('/uranio/api/');
//   const url = splitted_path[1];
//   const splitted_url = url.split('/');
//   let api_url = splitted_url[0];
//   if(splitted_url[0] === 'logs' && splitted_url.length > 1){
//     api_url = splitted_url[1];
//   }
//   if(!_is_valid_api_url(api_url)){
//     throw urn_exc.create_invalid_request(
//       `INVALID_PATH_WRONG_API_URL`,
//       `Invalid path. Invalid api url. Api url not present in api_book.`
//     );
//   }
//   return true;
// }

// function _is_valid_api_url(api_url:string){
//   let atom_name:keyof typeof api_book;
//   for(atom_name in api_book){
//     const api_def = api_book[atom_name] as types.Book.Definition<typeof atom_name>;
//     if(api_def.api && api_def.api.url && api_def.api.url === api_url){
//       return true;
//     }
//   }
//   return false;
// }

// function _get_atom_and_route_names(event:LambdaEvent){
//   const path = event.path;
//   const splitted_path = path.split('/uranio/api/');
//   const url = splitted_path[1];
//   const splitted_url = url.split('/');
//   let api_url = splitted_url[0];
//   let slice = 1;
//   if(api_url === 'logs' && splitted_url.length > 1){
//     api_url = splitted_url[1];
//     slice = 2;
//   }
//   let route_url = '/';
//   if(splitted_path.length > 1){
//     route_url += splitted_url.slice(slice).join('/');
//   }
//   const atom_name = _get_atom_name_from_atom_path(api_url);
//   const route_name = _get_route_name(atom_name, route_url, event.httpMethod);
//   return {atom_name, route_name};
// }

// function _get_atom_name_from_atom_path(atom_path:string)
//     :types.AtomName{
//   let atom_name:keyof typeof api_book;
//   for(atom_name in api_book){
//     const api_def = api_book[atom_name] as types.Book.Definition<typeof atom_name>;
//     if(api_def.api && api_def.api.url && api_def.api.url === atom_path){
//       return atom_name;
//     }
//   }
//   throw urn_exc.create(`INVALID_API_URL`, `Invalid api url.`);
// }

// function _get_route_name(atom_name:types.AtomName, route_path:string, http_method:types.RouteMethod){
//   const atom_api = _get_atom_api(atom_name);
//   if(!atom_api.routes){
//     throw urn_exc.create(`INVALID_API_DEF`, `Invalid api_def. Missing "routes" property.`);
//   }
//   for(const route_name in atom_api.routes){
//     const route_def = atom_api.routes[route_name];
//     if(route_def.method === http_method){
//       if(route_def.url === route_path){
//         return route_name;
//       }else if(route_def.url.includes(':')){
//         if(route_path[route_path.length - 1] !== '/'){
//           route_path += '/';
//         }
//         if(route_def.url[route_def.url.length - 1] !== '/'){
//           route_def.url += '/';
//         }
//         const splitted_route_def_url = route_def.url.split('/');
//         const splitted_route_url = route_path.split('/');
//         if(splitted_route_def_url.length !== splitted_route_url.length){
//           continue;
//         }
//         for(let i = 0; i < splitted_route_def_url.length; i++){
//           const url_part = splitted_route_def_url[i];
//           if(url_part[0] === ':' || url_part === splitted_route_url[i]){
//             continue;
//           }
//           throw urn_exc.create_invalid_request(
//             `IVALID_ROUTE_PATH`,
//             `Invalid route path.`
//           );
//         }
//         return route_name;
//       }
//     }
//   }
//   throw urn_exc.create_invalid_request(
//     `INVALID_PATH_ROUTE_NOT_FOUND`,
//     `Invalid path. Route not found or invalid.`
//   );
// }

// function _get_atom_api(atom_name:types.AtomName){
//   const atom_api = api_book[atom_name as keyof typeof api_book].api as
//     types.Book.Definition.Api;
//   const default_routes = return_default_routes(atom_name);
//   if(!atom_api.routes){
//     atom_api.routes = default_routes;
//   }else{
//     atom_api.routes = {
//       ...default_routes,
//       ...atom_api.routes
//     };
//   }
//   return atom_api;
// }

function _lambda_request_to_api_request(event: LambdaEvent, context: LambdaContext){
	const api_request_paths = process_request_path(event.path);

	const atom_name = get_atom_name_from_atom_path(api_request_paths.atom_path);
	const route_name = get_route_name(atom_name, api_request_paths.route_path, event.httpMethod);
	
	const is_auth = is_auth_request(atom_name, api_request_paths.atom_path);
	const auth_action = get_auth_action(atom_name, route_name);
	
	const ip = context.identity?.sourceIp || event.headers['client-ip'] || event.headers['X-Nf-Client-Connection-Ip'];
	const params = get_params_from_route_path(atom_name, route_name, api_request_paths.route_path);
	
	const api_request:types.ApiRequest = {
		...api_request_paths,
		// ****
		// TODO HTTP methods need to be all implemented.
		// ****
		method: event.httpMethod,
		atom_name: atom_name,
		route_name: route_name,
		is_auth: is_auth,
		auth_action: auth_action,
		params: params,
		query: event.queryStringParameters || {},
	};
	if(event.body){
		api_request.body = event.body;
	}
	if(event.headers){
		api_request.headers = event.headers;
	}
	if(ip){
		api_request.ip = ip;
	}
	return api_request;
}

// function _is_auth_request(atom_name: types.AtomName, atom_path: string)
//     :boolean{
//   const atom_api = api_book[atom_name]['api'] as types.Book.Definition.Api;
//   if(atom_api.auth && atom_api.auth === atom_path){
//     return true;
//   }
//   return false;
// }

// function _get_params_from_route_path(
//   atom_name: types.AtomName,
//   route_name: keyof types.Book.Definition.Api.Routes,
//   route_path: string
// ){
//   const atom_api = _get_atom_api(atom_name);
//   for(const route_key in atom_api.routes){
//     if(route_key === route_name){
//       const params:types.RouteRequestParams = {};
//       let atom_route_url = atom_api.routes[route_key].url;
//       if(atom_route_url[atom_route_url.length - 1] !== '/'){
//         atom_route_url += '/';
//       }
//       const atom_route_splitted = atom_route_url.split('/');
//       const splitted_route_path = route_path.split('/');
//       if(atom_route_splitted.length !== splitted_route_path.length){
//         throw urn_exc.create_invalid_request(
//           `INVALID_PATH_WRONG_FORMAT`,
//           `Invalid path. Format wrong for atom [${atom_name}] route [${route_name}]`
//         );
//       }
//       for(let i = 0; i < atom_route_splitted.length; i++){
//         const split = atom_route_splitted[i];
//         if(split[0] === ':'){
//           const param_name = split.substr(1,split.length);
//           const param_value = splitted_route_path[i];
//           params[param_name] = param_value;
//         }
//       }
//       return params;
//     }
//   }
//   throw urn_exc.create_invalid_request(
//     `INVALID_ROUTE_ATOM_NAME`,
//     `Invalid route or atom name.`
//   );
// }

// function _is_auth_route(atom_name:types.AtomName, path:string){
//   const atom_api = api_book[atom_name]['api'] as types.Book.Definition.Api;
//   if(urn_util.object.has_key(atom_api, 'auth')){
//     const auth_url = atom_api['auth'];
//     if(auth_url === path){
//       return true;
//     }
//   }
//   return false;
// }

function _return_handler_response(
	urn_resp:urn_response.General,
	headers?:LambdaHeaders,
	multi_value_headers?:LambdaMultiValueHeaders,
	is_base64?: boolean
):HandlerResponse{
	const handler_response:HandlerResponse = {
		statusCode: urn_resp.status,
		// body: JSON.stringify(urn_resp),
		body: urn_resp
	};
	if(headers){
		handler_response.headers = headers;
	}
	if(multi_value_headers){
		handler_response.multiValueHeaders = multi_value_headers;
	}
	if(typeof is_base64 === 'boolean'){
		handler_response.isBase64Encoded = is_base64;
	}
	return handler_response;
}

// function _handle_exception(ex:any){
//   let status = 500;
//   let msg = 'Internal Server Error';
//   let error_code = '500';
//   let error_msg = ex.message;
//   if(ex.type){
//     error_code = ex.module_code + '_' + ex.error_code;
//     error_msg = ex.msg;
//   }
//   switch(ex.type){
//     case urn_exception.ExceptionType.INVALID_REQUEST:{
//       status = 400;
//       msg = 'Invalid Request';
//       break;
//     }
//   }
//   const urn_error = urn_ret.return_error(
//     status,
//     msg,
//     error_code,
//     error_msg
//   );
//   return urn_error;
// }

export function create():NetlifyLambda{
	urn_log.fn_debug(`Create NetlifyLambda`);
	return new NetlifyLambda();
}

