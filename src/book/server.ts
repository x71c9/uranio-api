/**
 * Module for Server Atom Book Methods
 *
 * @packageDocumentation
 */

// export * from 'uranio-core/book/atom/index';

import core from 'uranio-core';

import {Book} from '../typ/book_srv';

import {schema} from '../sch/index';

export function add_definition<A extends schema.AtomName>(atom_name:A, atom_definition:Book.Definition<A>)
		:Book{
	return core.book.add_definition(atom_name, atom_definition);
}

export function get_names():schema.AtomName[]{
	return core.book.get_names();
}

export function validate_name(atom_name:string):boolean{
	return core.book.validate_name(atom_name);
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

export function get_custom_property_definitions<A extends schema.AtomName>(atom_name:A)
		:Book.Definition.Properties{
	return core.book.get_custom_property_definitions(atom_name);
}
export function get_all_property_definitions<A extends schema.AtomName>(atom_name:A)
		:Book.Definition.Properties{
	return core.book.get_all_property_definitions(atom_name);
}

export function has_property<A extends schema.AtomName>(atom_name:A, key:string)
		:boolean{
	return core.book.has_property(atom_name, key);
}
