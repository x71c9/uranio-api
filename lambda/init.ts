/**
 * Lambda init module
 *
 * @packageDocumentation
 */

// import {urn_log, urn_return, urn_exception, urn_response, urn_util} from 'urn-lib';

// import urn_core from 'uranio-core';

// import {api_book} from 'uranio-books/api';

// const urn_exc = urn_exception.init(`LAMBDAMODULE`, `Lambda handle module`);

// const urn_ret = urn_return.create(urn_log.util.return_injector);

// import {return_default_routes} from '../routes/';

// import {route_middleware, auth_route_middleware} from '../mdlw/';

// import * as types from '../types';

// import {
//   Event,
//   Context,
//   HandlerResponse,
//   Headers,
//   MultiValueHeaders,
//   HandleLambda
// } from './types';

// export function init()
//     :HandleLambda{
//   const bll_requests = urn_core.bll.log.create('request');
//   const bll_errors = urn_core.bll.log.create('error');
//   return {
//     handle: _init_handler(bll_requests, bll_errors)
//   };
// }

// function _init_handler(bll_reqs: urn_core.bll.BLL<'request'>, bll_errs:urn_core.bll.BLL<'error'>){
//   const log_blls = {
//     req: bll_reqs,
//     err: bll_errs
//   };
//   return async (event:Event, context:Context) => {
//     const path = event.path;
//     try{
//       _validate_path(path);
//     }catch(err){
//       const res_err = urn_ret.return_error(
//         400,
//         `Invalid path.`,
//         `INVALID_PATH`,
//         err.message,
//         null,
//         err
//       );
//       return _return_handler_response(res_err);
//     }
//     try{
//       const {atom_name, route_name} = _process_event(event);
//       const urn_response = await _lambda_route(event, context, atom_name, route_name, log_blls);
//       return _return_handler_response(urn_response);
//     }catch(ex){
//       let status = 500;
//       let msg = 'Internal Server Error';
//       let error_code = '500';
//       let error_msg = ex.message;
//       if(ex.type){
//         error_code = ex.module_code + '_' + ex.error_code;
//         error_msg = ex.msg;
//       }
//       switch(ex.type){
//         // case urn_exception.ExceptionType.UNAUTHORIZED:{
//         //   status = 401;
//         //   msg = 'Unauthorized';
//         //   break;
//         // }
//         // case urn_exception.ExceptionType.NOT_FOUND:{
//         //   status = 404;
//         //   msg = 'Not Found';
//         //   error_code = 'RECORD_NOT_FOUND';
//         //   error_msg = 'Record not found.';
//         //   break;
//         // }
//         case urn_exception.ExceptionType.INVALID_REQUEST:{
//           status = 400;
//           msg = 'Invalid Request';
//           break;
//         }
//       }
//       const urn_error = urn_ret.return_error(
//         status,
//         msg,
//         error_code,
//         error_msg
//       );
//       return _return_handler_response(urn_error);
//     }
//   };
// }

// async function _lambda_route(
//   event: Event,
//   context: Context,
//   atom_name: types.AtomName,
//   route_name: keyof types.Book.Definition.Api.Routes,
//   log_blls: types.LogBlls,
// ){
//   const raw_request = _lambda_to_raw_request(event, context, atom_name, route_name);
//   if(_is_auth_route(atom_name, event.path)){
//     // ****
//     // TODO CHECK - Maybe this can be a bad idea - to create the BLL on request
//     // instead of passing only one reference.
//     // ****
//     const auth_bll = urn_core.bll.auth.create(atom_name as types.AuthName);
//     const auth_handler = async (route_request:types.RouteRequest) => {
//       const token = await auth_bll.authenticate(
//         route_request.body.email,
//         route_request.body.password
//       );
//       return token;
//     };
//     return auth_route_middleware(atom_name as types.AuthName, route_name as string, auth_handler, raw_request, log_blls);
//   }else{
//     return route_middleware(atom_name, route_name, raw_request, log_blls);
//   }
// }

// function _lambda_to_raw_request(
//   event: Event,
//   context: Context,
//   atom_name: types.AtomName,
//   route_name: keyof types.Book.Definition.Api.Routes
// ){
//   const query = (event.queryStringParameters === null) ? {} : event.queryStringParameters;
//   let path = (event.path.includes('/uranio/api/')) ? event.path.split('/uranio/api/')[1] : event.path;
//   if(path[path.length - 1] !== '/'){
//     path += '/';
//   }
//   const ip = context.identity?.sourceIp || event.headers['client-ip'] || event.headers['X-Nf-Client-Connection-Ip'];
//   const raw_request:types.RawRequest = {
//     query: query,
//     params: _get_params_from_path(atom_name, route_name, path)
//   };
//   if(ip){
//     raw_request.ip = ip;
//   }
//   if(event.body){
//     raw_request.body = event.body;
//   }
//   if(event.headers){
//     raw_request.headers = event.headers;
//   }
//   return raw_request;
// }

// function _get_params_from_path(
//   atom_name: types.AtomName,
//   route_name: keyof types.Book.Definition.Api.Routes,
//   path:string
// ){
//   const atom_api = _get_atom_api(atom_name);
//   for(const route_key in atom_api.routes){
//     if(route_key === route_name){
//       const params:types.RouteRequestParams = {};
//       let atom_route_url = atom_api.routes[route_key].url;
//       if(atom_route_url[atom_route_url.length - 1] !== '/'){
//         atom_route_url += '/';
//       }
//       const atom_route_splitted = atom_route_url.split('/').slice(1);
//       const splitted_path = path.split('/').slice(1);
//       if(atom_route_splitted.length !== splitted_path.length){
//         throw urn_exc.create_invalid_request(
//           `INVALID_PATH_WRONG_FORMAT`,
//           `Invalid path. Format wrong for atom [${atom_name}] route [${route_name}]`
//         );
//       }
//       for(let i = 0; i < atom_route_splitted.length; i++){
//         const split = atom_route_splitted[i];
//         if(split[0] === ':'){
//           const param_name = split.substr(1,split.length);
//           const param_value = splitted_path[i];
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

// // function _get_route_def(atom_name:AtomName, route_name:keyof Book.Definition.Api.Routes){
// //   const atom_api = _get_atom_api(atom_name);
// //   if(!atom_api.routes){
// //     throw urn_exc.create(`INVALID_API_DEF`, `Invalid api_def. Missing "routes" property.`);
// //   }
// //   const route_def = atom_api.routes[route_name];
// //   if(!route_def){
// //     throw urn_exc.create(`INVALID_ROUTE_NAME`, `Invalid route name for Atom [${atom_name}] Route name [${route_name}]`);
// //   }
// //   return route_def;
// // }

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
//   const api_url = splitted_url[0];
//   if(!_is_valid_api_url(api_url)){
//     throw urn_exc.create_invalid_request(
//       `INVALID_PATH_WRONG_API_URL`,
//       `Invalid path. Invalid api url. Api url not present in api_book.`
//     );
//   }
//   return true;
// }

// function _process_event(event:Event){
//   const path = event.path;
//   const splitted_path = path.split('/uranio/api/');
//   const url = splitted_path[1];
//   const splitted_url = url.split('/');
//   const api_url = splitted_url[0];
//   let route_url = '/';
//   if(splitted_path.length > 1){
//     route_url += splitted_url.slice(1).join('/');
//   }
//   const atom_name = _get_atom_name_from_api_url(api_url);
//   const route_name = _get_route_name(atom_name, route_url, event.httpMethod);
//   return {atom_name, route_name};
// }

// function _get_route_name(
//   atom_name:types.AtomName,
//   route_url:string,
//   http_method:types.RouteMethod
// ){
//   const atom_api = _get_atom_api(atom_name);
//   if(!atom_api.routes){
//     throw urn_exc.create(`INVALID_API_DEF`, `Invalid api_def. Missing "routes" property.`);
//   }
//   for(const route_name in atom_api.routes){
//     const route_def = atom_api.routes[route_name];
//     if(route_def.method === http_method){
//       if(route_def.url === route_url){
//         return route_name;
//       }else if(route_def.url.includes(':')){
//         if(route_url[route_url.length - 1] !== '/'){
//           route_url += '/';
//         }
//         if(route_def.url[route_def.url.length - 1] !== '/'){
//           route_def.url += '/';
//         }
//         const splitted_route_def_url = route_def.url.split('/');
//         const splitted_route_url = route_url.split('/');
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

// function _get_atom_name_from_api_url(api_url:string)
//     :types.AtomName{
//   let atom_name:keyof typeof api_book;
//   for(atom_name in api_book){
//     const api_def = api_book[atom_name] as types.Book.Definition<typeof atom_name>;
//     if(api_def.api && api_def.api.url && api_def.api.url === api_url){
//       return atom_name;
//     }
//   }
//   throw urn_exc.create(`INVALID_API_URL`, `Invalid api url.`);
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

// function _return_handler_response(
//   urn_resp:urn_response.General,
//   headers?:Headers,
//   multi_value_headers?:MultiValueHeaders,
//   is_base64?: boolean
// ):HandlerResponse{
//   const handler_response:HandlerResponse = {
//     statusCode: urn_resp.status,
//     // body: JSON.stringify(urn_resp),
//     body: urn_resp
//   };
//   if(headers){
//     handler_response.headers = headers;
//   }
//   if(multi_value_headers){
//     handler_response.multiValueHeaders = multi_value_headers;
//   }
//   if(typeof is_base64 === 'boolean'){
//     handler_response.isBase64Encoded = is_base64;
//   }
//   return handler_response;
// }

