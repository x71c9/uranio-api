/**
 * Register module
 *
 * @packageDocumentation
 */

import core_client from 'uranio-core/client';

import * as types from '../cln/types';

import {schema} from '../sch/client';

export function register<A extends schema.AtomName>(
	atom_definition:types.Book.Definition,
	atom_name?:A
):string{
	return core_client.register(atom_definition, atom_name);
}

