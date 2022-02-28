/**
 * Register module
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

/**
 * See core server register atom
 */
import * as types from '../client/types';

import {schema} from '../sch/server';

import {return_default_routes} from '../routes/calls';

export function atom<A extends schema.AtomName>(
	atom_definition:types.Book.Definition,
	atom_name?:A
):string{
	if(atom_definition.dock && atom_definition.dock.url){
		if(!atom_definition.dock.routes){
			atom_definition.dock.routes = {};
		}
		const default_routes = return_default_routes('superuser');
		atom_definition.dock.routes = {
			...atom_definition.dock.routes,
			...default_routes
		};
	}
	return core.register.atom(atom_definition, atom_name);
}

