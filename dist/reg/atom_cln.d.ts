/**
 * Register module
 *
 * This method registers the atom_defintion in the Book.
 * Before register with the core_client method, it appends the
 * default routes if the paramter dock.url is definied.
 *
 * @packageDocumentation
 */
import * as types from '../client/types';
export declare function atom(atom_definition: types.Book.Definition, atom_name?: string): string;
