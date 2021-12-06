/**
 * Module for Server Dock Book Methods
 *
 * @packageDocumentation
 */

import urn_core from 'uranio-core';

import {Book} from '../../typ/book_srv';

import * as common from './common';

export function get_definition<A extends urn_core.types.AtomName>(atom_name:A)
		:Book.Definition.Dock{
	return common.get_definition(atom_name);
}

