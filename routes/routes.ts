/**
 * Routes module
 *
 * @packageDocumentation
 */

// import {urn_exception, urn_util} from 'urn-lib';
import {urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('ROUTESMODULE', 'Client routes module.');

// import {dock_book} from 'uranio-books/dock';

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

export function atom_dock_with_defaults(
	default_routes:types.Book.Definition.Dock.Routes,
	atom_name:types.AtomName
):types.Book.Definition.Dock{
	
	const atom_dock = _get_atom_dock(atom_name);
	
	if(!atom_dock.routes){
		atom_dock.routes = default_routes;
	}else{
		atom_dock.routes = {
			...atom_dock.routes,
			...default_routes
		};
	}
	
	return atom_dock;
}

function _get_atom_dock(atom_name:types.AtomName)
		:types.Book.Definition.Dock{
	// const dock_def = dock_book[atom_name] as types.Book.BasicDefinition;
	// if(urn_util.object.has_key(dock_def, 'dock')){
	//   const atom_dock = dock_def.dock as types.Book.Definition.Dock;
	//   return atom_dock;
	// }else{
	//   throw urn_exc.create(
	//     `INVLID_API_DEF`,
	//     'Invalid api definition in api_book.'
	//   );
	// }
	const dock_def = book.dock.get_definition(atom_name);
	return dock_def;
}
