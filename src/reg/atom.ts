/**
 * Register module
 *
 * This method registers the atom_defintion in the Book.
 * Before register with the core method, it appends the
 * default routes if the parameter dock.url is defined.
 *
 * It uses `return_default_routes('_superuser')` as default routes.
 * `_superuser` it is the same as any other Atoms.
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

/**
 * See core/reg/atom.ts why it is using client/types.
 */
import * as types from '../cln/types';

import {return_default_routes} from '../routes/calls';

// import {default_routes} from '../routes/client';

import {schema} from '../sch/client';

export function atom(
	atom_definition: types.Book.Definition,
	atom_name?: string
):string{
	const plural = atom_definition.plural || `${atom_name}s`;
	if(!atom_definition.dock){
		atom_definition.dock = {
			url: `/${plural}`,
			routes: {}
		};
	}
	if(!atom_definition.dock.url){
		atom_definition.dock.url = `/${plural}`;
	}
	if(!atom_definition.dock.routes){
		atom_definition.dock.routes = {};
	}
	
	const default_routes = return_default_routes(atom_name as schema.AtomName);
	
	atom_definition.dock.routes = {
		...atom_definition.dock.routes,
		...default_routes
	};
	return core.register.atom(atom_definition, atom_name);
}

