/**
 * Module for Server Atom Book Methods
 *
 * @packageDocumentation
 */

// export * from 'uranio-core/book/atom/index';

import {urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('BOOK_SERVER', 'Book server methods module');

import core from 'uranio-core';

import {Book as ClientBook} from '../typ/book_cln';

import {Book} from '../typ/book';

import {schema} from '../sch/server';

import * as book_client from './client';

export function get_route_definition<A extends schema.AtomName, R extends schema.RouteName<A>>(
	atom_name: A,
	route_name: R
):Book.Definition.Dock.Routes.Route<A,R>{
	const routes_def = get_routes_definition(atom_name);
	if(!routes_def || !routes_def[route_name]){
		throw urn_exc.create_invalid_book(
			`INVALID_ROUTE_NAME`,
			`Cannot find route name \`${route_name}\`.`
		);
	}
	return routes_def[route_name] as Book.Definition.Dock.Routes.Route<A,R>;
}

export function get_routes_definition<A extends schema.AtomName>(atom_name:A)
		:Book.Definition.Dock.Routes<A>{
	return book_client.get_routes_definition(atom_name) as Book.Definition.Dock.Routes<A>;
}

export function get_dock_definition<A extends schema.AtomName>(atom_name:A)
		:Book.Definition.Dock<A>{
	return book_client.get_dock_definition(atom_name) as Book.Definition.Dock<A>;
}

export function add_route_call<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth>(
	atom_name:A,
	route_name:R,
	route_call:Book.Definition.Dock.Routes.Route.Call<A,R,D>
):Book.Definition.Dock.Routes.Route<A,R,D>{
	const route_def = get_route_definition(atom_name, route_name);
	// if(!route_def){
	//   throw urn_exc.create(
	//     `INVALID_ROUTE_NAME`,
	//     `Cannot find route [${route_name}] for atom [${atom_name}].`
	//   );
	// }
	(route_def as Book.Definition.Dock.Routes.Route<A,R,D>).call = route_call;
	// Object.assign(atom_def.dock.routes, {...atom_def.dock.routes, route_name: route_definition});
	// Object.assign(atom_book, {...atom_book_def, ...atom_book});
	return route_def;
}
	
export function add_definition<A extends schema.AtomName>(
	atom_name:A,
	atom_definition:ClientBook.Definition
):Book{
	return core.book.add_definition(atom_name, atom_definition);
}

export function get_names():schema.AtomName[]{
	return core.book.get_names();
}

export function validate_name(atom_name:string):boolean{
	return core.book.validate_name(atom_name);
}

export function get_plural(atom_name:schema.AtomName):string{
	return core.book.get_plural(atom_name);
}

export function get_all_definitions():Book{
	return core.book.get_all_definitions();
}

export function get_definition<A extends schema.AtomName>(atom_name:A)
		:Book.Definition<A>{
	return core.book.get_definition(atom_name);
}

export function get_property_definition<A extends schema.AtomName>(
	atom_name:A,
	property_name:keyof Book.Definition.Properties
):Book.Definition.Property{
	return core.book.get_property_definition(atom_name, property_name);
}

export function get_custom_properties_definition<A extends schema.AtomName>(atom_name:A)
		:Book.Definition.Properties{
	return core.book.get_custom_properties_definition(atom_name);
}

export function get_properties_definition<A extends schema.AtomName>(atom_name:A)
		:Book.Definition.Properties{
	return core.book.get_properties_definition(atom_name);
}

export function has_property<A extends schema.AtomName>(atom_name:A, key:string)
		:boolean{
	return core.book.has_property(atom_name, key);
}

