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
		query: ['filter'],
	},
	find_one: {
		method: types.RouteMethod.GET,
		action: core.types.AuthAction.READ,
		url: '/first',
		query: ['filter', 'options'],
	},
	find: {
		method: types.RouteMethod.GET,
		action: core.types.AuthAction.READ,
		url: '/',
		query: ['filter', 'options'],
	},
	find_id: {
		method: types.RouteMethod.GET,
		action: core.types.AuthAction.READ,
		url: '/:id',
		query: ['options'],
	},
	insert: {
		method: types.RouteMethod.POST,
		action: core.types.AuthAction.WRITE,
		url: '/',
	},
	update: {
		method: types.RouteMethod.POST,
		action: core.types.AuthAction.WRITE,
		url: '/:id',
	},
	delete: {
		method: types.RouteMethod.DELETE,
		action: core.types.AuthAction.WRITE,
		url: '/:id',
	},
	insert_multiple: {
		method: types.RouteMethod.POST,
		action: core.types.AuthAction.WRITE,
		url: '/multiple',
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
	},
} as const;

export function add_media_routes():typeof default_routes{
	const cloned_default_routes = {
		upload:{
			method: types.RouteMethod.POST,
			action: core.types.AuthAction.WRITE,
			url: '/upload',
		},
		presigned:{
			method: types.RouteMethod.GET,
			action: core.types.AuthAction.WRITE,
			query: ['filename', 'size', 'type'],
			url: '/presigned',
		},
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
