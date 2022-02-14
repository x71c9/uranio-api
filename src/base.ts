/**
 * Required API books
 *
 * @packageDocumentation
 */

// import {core.types.BookSecurity, core.types.BookProperty, core.types.BookPermission} from './typ/book_srv';

import * as types from './types';

import core from 'uranio-core';

export const atom_book = {
	error: {
		plural: 'errors',
		read_only: true,
		connection: 'log',
		security: {
			type: core.types.BookSecurity.UNIFORM,
			_r: core.types.BookPermission.NOBODY
		},
		properties: {
			status: {
				type: core.types.BookProperty.INTEGER,
				label: 'Status'
			},
			msg: {
				type: core.types.BookProperty.TEXT,
				label: 'Message'
			},
			error_code: {
				type: core.types.BookProperty.TEXT,
				label: 'Error Code'
			},
			error_msg: {
				type: core.types.BookProperty.TEXT,
				label: 'Error Message'
			},
			request: {
				type: core.types.BookProperty.ATOM,
				label: 'Request',
				atom: 'request',
				delete_cascade: true,
				optional: true
			},
			stack: {
				type: core.types.BookProperty.LONG_TEXT,
				label: 'Stack',
				optional: true
			}
		},
		dock:{
			url: '/errors',
			routes: {
				errroute: {
					method: types.RouteMethod.GET,
					action: core.types.AuthAction.READ,
					url: '/errrr',
					query: ['title','length'],
					params: {},
					return: String
				}
			}
		}
	},
	request: {
		plural: 'requests',
		read_only: true,
		connection: 'log',
		security: {
			type: core.types.BookSecurity.UNIFORM,
			_r: core.types.BookPermission.NOBODY
		},
		properties: {
			full_path: {
				type: core.types.BookProperty.TEXT,
				label: "Full path",
			},
			route_path: {
				type: core.types.BookProperty.TEXT,
				label: "Route path",
				optional: true
			},
			atom_path: {
				type: core.types.BookProperty.TEXT,
				label: "Atom path",
				optional: true
			},
			connection_path: {
				type: core.types.BookProperty.TEXT,
				label: "Connection path",
				optional: true
			},
			method: {
				type: core.types.BookProperty.ENUM_STRING,
				label: "Method",
				values: ['GET', 'POST', 'DELETE'],
				optional: true,
			},
			atom_name: {
				type: core.types.BookProperty.TEXT,
				label: "Atom name",
				optional: true,
				on_error: () => {
					return "generic_atom";
				},
			},
			route_name: {
				type: core.types.BookProperty.TEXT,
				label: "Route name",
				optional: true,
			},
			params: {
				type: core.types.BookProperty.TEXT,
				label: "Params",
				optional: true,
			},
			query: {
				type: core.types.BookProperty.TEXT,
				label: "Query",
				optional: true,
			},
			headers: {
				type: core.types.BookProperty.LONG_TEXT,
				label: "Headers",
				optional: true,
			},
			body: {
				type: core.types.BookProperty.LONG_TEXT,
				label: "Body",
				optional: true,
			},
			file: {
				type: core.types.BookProperty.TEXT,
				label: "File",
				optional: true,
			},
			ip: {
				type: core.types.BookProperty.TEXT,
				label: "IP",
				optional: true
			},
			is_auth: {
				type: core.types.BookProperty.BINARY,
				label: "Is auth",
				optional: true
			},
			auth_action: {
				type: core.types.BookProperty.ENUM_STRING,
				label: "Auth action",
				values: ["READ", "WRITE", "AUTH"],
				on_error: () => {
					return "READ";
				},
				optional: true,
			},
		},
		dock:{
			url: '/requests'
		}
	},
} as const;

