/**
 * Client routes module
 *
 * @packageDocumentation
 */

import core from 'uranio-core/client';

import * as types from '../client/types';

// import {schema} from '../sch/index';

// import {
//   route_def as common_route_def,
//   atom_dock_with_defaults as common_atom_dock_with_defaults
// } from './common';

/**
 *
 * NOTE:
 *
 * If the default routes change, they must change also in:
 * - routes/server.ts
 * - uranio/urn-cli/cmd/hook.ts
 *
 */
export const default_routes = {
	count: {
		method: types.RouteMethod.GET,
		action: core.types.AuthAction.READ,
		url: '/count',
		return: 'number',
		query: ['filter'],
	},
	find_one: {
		method: types.RouteMethod.GET,
		action: core.types.AuthAction.READ,
		url: '/first',
		return: 'Molecule<A,D>',
		query: ['filter', 'options'],
	},
	find: {
		method: types.RouteMethod.GET,
		action: core.types.AuthAction.READ,
		url: '/',
		return: 'Molecule<A,D>[]',
		query: ['filter', 'options'],
	},
	find_id: {
		method: types.RouteMethod.GET,
		action: core.types.AuthAction.READ,
		url: '/:id',
		return: 'Molecule<A,D>',
		query: ['options'],
	},
	insert: {
		method: types.RouteMethod.POST,
		action: core.types.AuthAction.WRITE,
		url: '/',
		return: 'Molecule<A,D>',
	},
	update: {
		method: types.RouteMethod.POST,
		action: core.types.AuthAction.WRITE,
		url: '/:id',
		return: 'Molecule<A,D>',
	},
	delete: {
		method: types.RouteMethod.DELETE,
		action: core.types.AuthAction.WRITE,
		url: '/:id',
		return: 'Molecule<A,D>',
	},
	insert_multiple: {
		method: types.RouteMethod.POST,
		action: core.types.AuthAction.WRITE,
		url: '/multiple',
		return: 'Molecule<A,D>[]',
	},
	update_multiple: {
		method: types.RouteMethod.POST,
		action: core.types.AuthAction.WRITE,
		params: {
			ids: {
				array: true
			}
		},
		url: '/multiple/:ids',
		return: 'Molecule<A,D>[]',
	},
	delete_multiple: {
		method: types.RouteMethod.DELETE,
		action: core.types.AuthAction.WRITE,
		params: {
			ids: {
				array: true
			}
		},
		url: '/multiple/:ids',
		return: 'Molecule<A,D>[]',
	},
} as const;

export const media_routes = {
	upload:{
		method: types.RouteMethod.POST,
		action: core.types.AuthAction.WRITE,
		url: '/upload',
		return: 'Molecule<A,D>[]',
	},
	presigned:{
		method: types.RouteMethod.GET,
		action: core.types.AuthAction.WRITE,
		query: ['filename', 'size', 'type'],
		url: '/presigned',
		return: 'string',
	}
} as const;

export function add_media_routes():typeof default_routes{
	const cloned_default_routes = {
		...media_routes,
		...default_routes
	};
	return cloned_default_routes as typeof default_routes;
}

// export function route_def<A extends schema.AtomName>(atom_name:A, route_name:schema.RouteName<A>)
//     :types.Book.Definition.Dock.Routes.Route{
	
//   const cloned_default_routes = add_media_routes();
	
//   return common_route_def(cloned_default_routes as any, atom_name, route_name);
// }

// export function atom_dock_with_defaults(
//   default_routes:types.Book.Definition.Dock.Routes,
//   atom_name:schema.AtomName
// ):types.Book.Definition.Dock{
//   return common_atom_dock_with_defaults(default_routes, atom_name);
// }
