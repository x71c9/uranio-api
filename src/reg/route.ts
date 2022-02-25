/**
 * Register module
 *
 * @packageDocumentation
 */

/**
 * See core server register atom
 */
import * as types from '../client/types';

import {schema} from '../sch/server';

import {route as route_client} from './route_cln';

export function route<A extends schema.AtomName>(
	route_def:types.Book.Definition.Dock.Routes.Route,
	atom_name?:A,
	route_name?:schema.RouteName<A>
):string{
	return route_client(route_def, atom_name, route_name);
}

