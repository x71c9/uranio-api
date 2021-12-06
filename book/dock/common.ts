/**
 * Common module for Dock Book Methods
 *
 * Since type Book is different between Server and Client we need two different
 * module with methods with different return types.
 *
 * @packageDocumentation
 */

import urn_core from 'uranio-core/client';

import {dock_book} from 'uranio-books/dock';

import {Book} from '../../typ/book_cln';

export function get_definition<A extends urn_core.types.AtomName>(atom_name:A)
		:Book.Definition.Dock{
	return dock_book[atom_name].dock as Book.Definition.Dock;
}

