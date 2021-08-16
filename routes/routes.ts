/**
 * Routes module
 *
 * @packageDocumentation
 */

import {urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('ROUTESMODULE', 'Client routes module.');

import {api_book} from 'uranio-books-client/api';

import * as types from '../cln/types';

export function route_def(
	default_routes:types.Book.Definition.Api.Routes,
	atom_name:types.AtomName,
	route_name:string
):types.Book.Definition.Api.Routes.Route{
		
	const atom_api = atom_api_with_defaults(default_routes, atom_name);
		
	if(!atom_api.routes?.[route_name]){
		throw urn_exc.create(`INVALID_ROUTE_NAME`, `Invalid route name.`);
	}
	
	return atom_api.routes[route_name]!;
}

export function atom_api_with_defaults(
	default_routes:types.Book.Definition.Api.Routes,
	atom_name:types.AtomName
):types.Book.Definition.Api{
	
	const atom_api = _get_atom_api(atom_name);
	
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

function _get_atom_api(atom_name:types.AtomName)
		:types.Book.Definition.Api{
	
	const atom_api = api_book[atom_name as keyof typeof api_book].api as
		types.Book.Definition.Api;
	
	if(!atom_api){
		throw urn_exc.create(
			`INVLID_API_DEF`,
			'Invalid api definition in api_book.'
		);
	}
	
	return atom_api;
	
}
