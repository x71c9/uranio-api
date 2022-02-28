/**
 * Register module
 *
 * @packageDocumentation
 */

import core_client from 'uranio-core/client';

import * as types from '../client/types';

import {schema} from '../sch/client';

import {default_routes} from '../routes/client';

export function atom<A extends schema.AtomName>(
	atom_definition:types.Book.Definition,
	atom_name?:A
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

