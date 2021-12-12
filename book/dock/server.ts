/**
 * Module for Server Dock Book Methods
 *
 * @packageDocumentation
 */

// import * as book_dock from 'uranio-core/book/dock/';

// export * from 'uranio-core/book/dock/';

import {dock_book} from 'uranio-books/dock';

import {AtomName} from '../../types';

import {Book} from '../../typ/book_srv';

// export function get_definition<A extends AtomName>(atom_name:A)
//     :Book.Definition.Dock{
//   return book_dock.get_definition(atom_name) as Book.Definition.Dock;
// }

export function get_definition<A extends AtomName>(atom_name:A)
		:Book.Definition.Dock{
	return dock_book[atom_name].dock as Book.Definition.Dock;
}
