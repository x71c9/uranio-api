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
/**
 * See core/reg/atom.ts why it is using client/types.
 */
import * as types from '../cln/types';
export declare function atom(atom_definition: types.Book.Definition, atom_name?: string): string;
