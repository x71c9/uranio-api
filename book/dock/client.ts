/**
 * Module for Client Dock Book Methods
 *
 * @packageDocumentation
 */

import * as book_dock from 'uranio-core/book/dock/client';

export * from 'uranio-core/book/dock/client';

import {AtomName} from '../../cln/types';

import {Book} from '../../typ/book_cln';

export function get_definition<A extends AtomName>(atom_name:A)
		:Book.Definition.Dock{
	return book_dock.get_definition(atom_name) as Book.Definition.Dock;
}
