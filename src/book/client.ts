/**
 * Module for Client Book Methods
 *
 * @packageDocumentation
 */

// import {urn_util, urn_exception} from 'urn-lib';
import {urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('BOOK_CLIENT', 'Book client methods module');

import core_client from 'uranio-core/client';

import {Book} from '../typ/book_cln';

import {schema} from '../sch/client';

// import {default_routes, media_routes} from '../routes/client';

export function get_route_definition<A extends schema.AtomName, R extends schema.RouteName<A>>(
	atom_name: A,
	route_name: R
):Book.Definition.Dock.Routes.Route{
	const routes_def = get_routes_definition(atom_name);
	if(!routes_def || !routes_def[route_name]){
		throw urn_exc.create_invalid_book(
			`INVALID_ROUTE_NAME`,
			`Cannot find route name \`${route_name}\`.`
		);
	}
	return routes_def[route_name];
}

export function get_routes_definition<A extends schema.AtomName>(atom_name:A)
		:Book.Definition.Dock.Routes{
	const dock_def = get_dock_definition(atom_name);
	if(!dock_def.routes){
		dock_def.routes = {};
	}
	return dock_def.routes;
}

export function get_dock_definition<A extends schema.AtomName>(atom_name:A)
		:Book.Definition.Dock{
	const atom_def = get_definition(atom_name);
	const dock_def = atom_def.dock;
	if(!dock_def || !dock_def.url){
		throw urn_exc.create_invalid_book(
			`INVALID_DOCK_DEFINITION`,
			`Atom [${atom_name}] has no or invalid dock definition.`
		);
		// let cloned_default_routes = urn_util.object.deep_clone(default_routes);
		// if(atom_name === 'media'){
		//   const cloned_media_routes = urn_util.object.deep_clone(media_routes);
		//   cloned_default_routes = {
		//     ...cloned_default_routes,
		//     ...cloned_media_routes
		//   };
		// }
		// return {
		//   url: `/${get_plural(atom_name)}`,
		//   routes: cloned_default_routes as any
			
		// } as Book.Definition.Dock;
	}
	return dock_def;
}

export function add_route_definition<A extends schema.AtomName, R extends schema.RouteName<A>>(
	atom_name: A,
	route_name: R,
	route_definition: Book.Definition.Dock.Routes.Route
):Book.Definition.Dock.Routes{
	try{
		const routes_definition = get_routes_definition(atom_name);
		routes_definition[route_name] = route_definition;
		return routes_definition;
	}catch(ex){
		const err = ex as urn_exception.InvalidBookExceptionInstance;
		if(err.type === urn_exception.ExceptionType.INVALID_BOOK){
			throw urn_exc.create_invalid_book(
				`INVALID_DOCK_DEFINITION`,
				`Cannot add route definition for Atom [${atom_name}].` +
				` Please make sure Atom definition has property \`dock\` defined and` +
				` with property \`url\` also defined: {dock: {url: '/[atom_name_plural]'}}`
			);
		}else{
			throw ex;
		}
	}
}

export function add_definition<A extends schema.AtomName>(atom_name:A, atom_definition:Book.Definition)
		:Book{
	return core_client.book.add_definition(atom_name, atom_definition);
}

export function get_plural(atom_name:schema.AtomName):string{
	return core_client.book.get_plural(atom_name);
}

export function validate_name(atom_name:string):atom_name is schema.AtomName{
	return core_client.book.validate_name(atom_name);
}

export function validate_auth_name(auth_name:string):auth_name is schema.AuthName{
	return core_client.book.validate_auth_name(auth_name);
}

export function get_all_definitions():Book{
	return core_client.book.get_all_definitions();
}

export function get_definition<A extends schema.AtomName>(atom_name:A)
		:Book.Definition{
	return core_client.book.get_definition(atom_name);
}

export function get_property_definition<A extends schema.AtomName>(
	atom_name:A,
	property_name:keyof Book.Definition.Properties
):Book.Definition.Property{
	return core_client.book.get_property_definition(atom_name, property_name);
}

export function get_custom_properties_definition<A extends schema.AtomName>(
	atom_name:A
):Book.Definition.Properties{
	return core_client.book.get_custom_properties_definition(atom_name);
}

export function get_properties_definition<A extends schema.AtomName>(
	atom_name:A
):Book.Definition.Properties{
	return core_client.book.get_properties_definition(atom_name);
}

export function has_property<A extends schema.AtomName>(atom_name:A, key:string)
		:boolean{
	return core_client.book.has_property(atom_name, key);
}

export function get_names():schema.AtomName[]{
	return core_client.book.get_names();
}

