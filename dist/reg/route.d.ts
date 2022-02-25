/**
 * Register module
 *
 * @packageDocumentation
 */
/**
 * See core server register atom
 */
import * as types from '../client/types';
import { schema } from '../sch/server';
export declare function route<A extends schema.AtomName>(route_def: types.Book.Definition.Dock.Routes.Route, atom_name?: A, route_name?: schema.RouteName<A>): string;
