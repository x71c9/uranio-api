/**
 * Module for Client Book Methods
 *
 * @packageDocumentation
 */

// import * as atom from './atom/client';

// export {atom};

// import * as dock from './dock/client';

// export {dock};

import core_client from 'uranio-core/client';

import {Book} from '../typ/book_cln';

import {schema} from '../sch/index';

// export function get_dock_definition<A extends schema.AtomName>(atom_name:A)
//     :Book.Definition.Dock<A>{
	
// }

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

export function get_all_property_definitions<A extends schema.AtomName>(
	atom_name:A
):Book.Definition.Properties{
	return core_client.book.get_all_property_definitions(atom_name);
}

export function has_property<A extends schema.AtomName>(atom_name:A, key:string)
		:boolean{
	return core_client.book.has_property(atom_name, key);
}

export function get_names():schema.AtomName[]{
	return core_client.book.get_names();
}

