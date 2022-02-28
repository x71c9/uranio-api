/**
 * Register module
 *
 * @packageDocumentation
 */
import * as types from '../server/types';
import { schema } from '../sch/server';
export declare function route<A extends schema.AtomName, R extends schema.RouteName<A>>(route_call: types.Book.Definition.Dock.Routes.Route.Call<A, R>, atom_name?: A, route_name?: R): string;
