/**
 * Public part of routes
 *
 * @packageDocumentation
 */

import * as types from '../cln/types';

export const default_routes = {
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
	find_one: {
		method: types.RouteMethod.GET,
		action: types.AuthAction.READ,
		url: '/',
		query: ['filter', 'options'],
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
};
