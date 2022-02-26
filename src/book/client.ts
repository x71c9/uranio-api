/**
 * Module for Client Book Methods
 *
 * @packageDocumentation
 */

import {urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('BOOK_CLIENT', 'Book client methods module');

import core_client from 'uranio-core/client';

import {Book} from '../typ/book_cln';

import {schema} from '../sch/client';

import {default_routes} from '../routes/client';

export function get_route_def<A extends schema.AtomName, R extends schema.RouteName<A>>(
	atom_name: A,
	route_name: R
):Book.Definition.Dock.Routes.Route{
	const routes_def = get_routes_definition_with_defaults(atom_name);
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

export function get_routes_definition_with_defaults(atom_name:schema.AtomName)
		:Book.Definition.Dock.Routes{
	const dock_def = get_dock_definition(atom_name);
	if(!dock_def.routes){
		dock_def.routes = {};
	}
	for(const [route_name, route_def] of Object.entries(default_routes)){
		dock_def.routes[route_name] = route_def as Book.Definition.Dock.Routes.Route;
	}
	return dock_def.routes;
}

export function get_dock_definition<A extends schema.AtomName>(atom_name:A)
		:Book.Definition.Dock{
	const atom_def = get_definition(atom_name);
	const dock_def = atom_def.dock;
	if(!dock_def || !dock_def.url){
		return {
			url: `/${get_plural(atom_name)}`
		} as Book.Definition.Dock;
	}
	return dock_def;
}

// export function add_route_definition<A extends schema.AtomName>(
//   atom_name:A,
//   route_name: schema.RouteName<A>,
//   route_definition:Book.Definition.Dock.Routes.Route
// ):Book{
//   const atom_book = get_all_definitions();
//   const atom_def = atom_book[atom_name];
//   if(!atom_def){
//     throw urn_exc.create(
//       `INVALID_ATOM_NAME`,
//       `Cannot get atom definition in [add_route_definition]`
//     );
//   }
//   if(!atom_def.dock){
//     atom_def.dock = {
//       url: `/${get_plural(atom_name)}`
//     };
//   }
//   if(!atom_def.dock.routes){
//     atom_def.dock.routes = {};
//   }
//   atom_def.dock.routes[route_name] = route_definition;
//   // Object.assign(atom_def.dock.routes, {...atom_def.dock.routes, route_name: route_definition});
//   // Object.assign(atom_book, {...atom_book_def, ...atom_book});
//   return atom_book;
// }

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

export function get_custom_property_definitions<A extends schema.AtomName>(
	atom_name:A
):Book.Definition.Properties{
	return core_client.book.get_custom_property_definitions(atom_name);
}

export function get_full_properties_definition<A extends schema.AtomName>(
	atom_name:A
):Book.Definition.Properties{
	return core_client.book.get_full_properties_definition(atom_name);
}

export function has_property<A extends schema.AtomName>(atom_name:A, key:string)
		:boolean{
	return core_client.book.has_property(atom_name, key);
}

export function get_names():schema.AtomName[]{
	return core_client.book.get_names();
}

