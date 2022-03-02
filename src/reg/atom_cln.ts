/**
 * Register module
 *
 * This method registers the atom_defintion in the Book.
 * Before register with the core_client method, it appends the
 * default routes if the paramter dock.url is definied.
 *
 * @packageDocumentation
 */

import core_client from 'uranio-core/client';

import * as types from '../client/types';

import {default_routes} from '../routes/client';

export function atom(
	atom_definition: types.Book.Definition,
	atom_name?: string
):string{
	if(atom_definition.dock && atom_definition.dock.url){
		if(!atom_definition.dock.routes){
			atom_definition.dock.routes = {};
		}
		atom_definition.dock.routes = {
			...atom_definition.dock.routes,
			...default_routes as any
		};
	}
	return core_client.register.atom(atom_definition, atom_name);
}

