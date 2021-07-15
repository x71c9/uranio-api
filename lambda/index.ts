/**
 * Lambda handle module
 *
 * @packageDocumentation
 */

// import {web_config} from '../conf/defaults';

import {urn_log, urn_return, urn_exception, urn_response} from 'urn-lib';

// import {atom_book} from 'uranio-books/atom';

import {api_book} from 'uranio-books/api';

const urn_exc = urn_exception.init(`LAMBDAMODULE`, `Lambda handle module.`);

const urn_ret = urn_return.create(urn_log.util.return_injector);

import {Book} from '../types';

import {Event, Context, HandlerResponse, Headers, MultiValueHeaders} from './types';

// export * from './types';

export async function handle(event:Event, _context:Context)
		:Promise<HandlerResponse>{
	const path = event.path;
	try{
		const {api_url, route_url} = _process_path(path);
		console.log(api_url, route_url);
	}catch(err){
		const res_err = urn_ret.return_error(
			500,
			`Invalid path.`,
			`INVALID_PATH`,
			err.message,
			null,
			err
		);
		return _return_handler_response(res_err);
	}
	return _return_handler_response(urn_ret.return_success(''));
}

function _process_path(path:string){
	if(!path.includes('/uranio/api/')){
		throw urn_exc.create_invalid_request(
			`INVALID_PATH_WRONG_PREFIX`,
			`Invalid path. Invalid prefix.`
		);
	}
	const splitted_path = path.split('/uranio/api/');
	const url = splitted_path[1];
	const splitted_url = url.split('/');
	const api_url = splitted_url[0];
	if(!_is_valid_api_url(api_url)){
		throw urn_exc.create_invalid_request(
			`INVALID_PATH_WRONG_API_URL`,
			`Invalid path. Invalid api url. Api url not present in api_book.`
		);
	}
	let route_url = '/';
	if(splitted_path.length > 1){
		route_url += splitted_url.slice(1).join('/');
	}
	return {api_url, route_url};
}

function _is_valid_api_url(api_url:string){
	let atom_name:keyof typeof api_book;
	for(atom_name in api_book){
		const api_def = api_book[atom_name] as Book.Definition<typeof atom_name>;
		if(api_def.api && api_def.api.url && api_def.api.url === api_url){
			return true;
		}
	}
	return false;
}

function _return_handler_response(
	urn_resp:urn_response.General,
	headers?:Headers,
	multi_value_headers?:MultiValueHeaders,
	is_base64?: boolean
):HandlerResponse{
	const handler_response = {
		statusCode: urn_resp.status,
		body: JSON.stringify(urn_resp),
		headers: headers,
		multiValueHeaders: multi_value_headers,
		isBase64Encoded: is_base64
	};
	return handler_response;
}
