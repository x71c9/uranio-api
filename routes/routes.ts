/**
 * Routes module
 *
 * @packageDocumentation
 */

import {urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('ROUTESMODULE', 'Client routes module.');

import * as book from '../book/client';

import * as types from '../cln/types';

export function route_def<A extends types.AtomName>(
	default_routes:types.Book.Definition.Dock.Routes,
	atom_name:A,
	route_name:types.RouteName<A>
):types.Book.Definition.Dock.Routes.Route{
		
	const atom_dock = atom_dock_with_defaults(default_routes, atom_name);
		
	if(!atom_dock.routes?.[route_name as string]){
		throw urn_exc.create(`INVALID_ROUTE_NAME`, `Invalid route name.`);
	}
	
	return atom_dock.routes[route_name as string]!;
}

export function atom_dock_with_defaults<A extends types.AtomName>(
	default_routes:types.Book.Definition.Dock.Routes,
	atom_name:A
):types.Book.Definition.Dock{
	
	const cloned_atom_dock = {
		...book.dock.get_definition(atom_name)
	};
	
	if(!cloned_atom_dock.routes){
		cloned_atom_dock.routes = default_routes;
	}else{
		cloned_atom_dock.routes = {
			...cloned_atom_dock.routes,
			...default_routes
		};
	}
	
	return cloned_atom_dock;
}
