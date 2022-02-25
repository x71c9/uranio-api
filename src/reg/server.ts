/**
 * Register module
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

import * as types from '../server/types';

import {schema} from '../sch/server';

export function register<A extends schema.AtomName>(
	atom_definition:types.Book.Definition<A>,
	atom_name?:A
):string{
	return core.register(atom_definition, atom_name);
}

