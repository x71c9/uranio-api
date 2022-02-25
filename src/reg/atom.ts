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

export function atom<A extends schema.AtomName>(
	atom_definition:types.Book.Definition,
	atom_name?:A
):string{
	return core.register.atom(atom_definition, atom_name);
}

