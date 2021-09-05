/**
 * Client routes module
 *
 * @packageDocumentation
 */

import * as types from '../cln/types';

import {
	route_def as common_route_def,
	atom_dock_with_defaults as common_atom_dock_with_defaults
} from './routes';

export const default_routes = {
	count: {
		method: types.RouteMethod.GET,
		action: types.AuthAction.READ,
		url: '/count',
		query: ['filter'],
	},
	find_one: {
		method: types.RouteMethod.GET,
		action: types.AuthAction.READ,
		url: '/first',
		query: ['filter', 'options'],
	},
	find: {
		method: types.RouteMethod.GET,
		action: types.AuthAction.READ,
		url: '/',
		query: ['filter', 'options'],
	},
	find_id: {
		method: types.RouteMethod.GET,
		action: types.AuthAction.READ,
		url: '/:id',
		query: ['options'],
	},
	insert: {
		method: types.RouteMethod.POST,
		action: types.AuthAction.WRITE,
		url: '/',
	},
	update: {
		method: types.RouteMethod.POST,
		action: types.AuthAction.WRITE,
		url: '/:id',
	},
	delete: {
		method: types.RouteMethod.DELETE,
		action: types.AuthAction.WRITE,
		url: '/:id',
	}
} as const;

export function route_def<A extends types.AtomName>(atom_name:A, route_name:types.RouteName<A>)
		:types.Book.Definition.Dock.Routes.Route{
	return common_route_def(default_routes as any, atom_name, route_name);
}

export function atom_dock_with_defaults(
	default_routes:types.Book.Definition.Dock.Routes,
	atom_name:types.AtomName
):types.Book.Definition.Dock{
	return common_atom_dock_with_defaults(default_routes, atom_name);
}
