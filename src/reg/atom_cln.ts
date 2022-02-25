/**
 * Register module
 *
 * @packageDocumentation
 */

import core_client from 'uranio-core/client';

import * as types from '../client/types';

import {schema} from '../sch/client';

export function atom<A extends schema.AtomName>(
	atom_definition:types.Book.Definition,
	atom_name?:A
):string{
	return core_client.register.atom(atom_definition, atom_name);
}

