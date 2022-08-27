/**
 * Required API books
 *
 * @packageDocumentation
 */

import * as types from '../cln/types';

export const required_atoms = {
	_error: {
		plural: '_errors',
		read_only: true,
		connection: 'log',
		security: {
			type: types.SecurityType.UNIFORM,
			_r: types.PermissionType.NOBODY
		},
		properties: {
			status: {
				type: types.PropertyType.INTEGER,
				primary: true,
				label: 'Status'
			},
			msg: {
				type: types.PropertyType.TEXT,
				search: true,
				primary: true,
				label: 'Message'
			},
			error_code: {
				type: types.PropertyType.TEXT,
				search: true,
				primary: true,
				label: 'Error Code'
			},
			error_msg: {
				type: types.PropertyType.TEXT,
				search: true,
				primary: true,
				label: 'Error Message'
			},
			request: {
				type: types.PropertyType.ATOM,
				label: 'Request',
				atom: '_request',
				delete_cascade: true,
				optional: true
			},
			stack: {
				type: types.PropertyType.LONG_TEXT,
				search: true,
				label: 'Stack',
				optional: true
			}
		},
		dock:{
			url: '/_errors',
			// routes: {
			//   errroute: {
			//     method: types.RouteMethod.GET,
			//     action: core.types.AuthAction.READ,
			//     url: '/errrr',
			//     query: ['title','length'],
			//     params: {},
			//     return: 'string'
			//   }
			// }
		}
	},
	_request: {
		plural: '_requests',
		read_only: true,
		connection: 'log',
		security: {
			type: types.SecurityType.UNIFORM,
			_r: types.PermissionType.NOBODY
		},
		properties: {
			full_path: {
				type: types.PropertyType.TEXT,
				search: true,
				primary: true,
				label: "Full path",
			},
			route_path: {
				type: types.PropertyType.TEXT,
				search: true,
				label: "Route path",
				optional: true
			},
			atom_path: {
				type: types.PropertyType.TEXT,
				search: true,
				label: "Atom path",
				optional: true
			},
			connection_path: {
				type: types.PropertyType.TEXT,
				search: true,
				label: "Connection path",
				optional: true
			},
			method: {
				type: types.PropertyType.ENUM_STRING,
				label: "Method",
				values: ['GET', 'POST', 'DELETE'],
				optional: true,
			},
			atom_name: {
				type: types.PropertyType.TEXT,
				search: true,
				label: "Atom name",
				optional: true,
				on_error: () => {
					return "generic_atom";
				},
			},
			route_name: {
				type: types.PropertyType.TEXT,
				search: true,
				label: "Route name",
				optional: true,
			},
			params: {
				type: types.PropertyType.TEXT,
				search: true,
				label: "Params",
				optional: true,
			},
			query: {
				type: types.PropertyType.TEXT,
				search: true,
				label: "Query",
				optional: true,
			},
			headers: {
				type: types.PropertyType.LONG_TEXT,
				search: true,
				label: "Headers",
				optional: true,
			},
			body: {
				type: types.PropertyType.LONG_TEXT,
				search: true,
				label: "Body",
				optional: true,
			},
			file: {
				type: types.PropertyType.TEXT,
				label: "File",
				optional: true,
			},
			ip: {
				type: types.PropertyType.TEXT,
				search: true,
				label: "IP",
				optional: true
			},
			is_auth: {
				type: types.PropertyType.BINARY,
				label: "Is auth",
				optional: true
			},
			auth_action: {
				type: types.PropertyType.ENUM_STRING,
				label: "Auth action",
				values: ["READ", "WRITE", "AUTH"],
				on_error: () => {
					return "READ";
				},
				optional: true,
			},
		},
		dock:{
			url: '/_requests'
		}
	},
} as const;

