/**
 * Required API books
 *
 * @packageDocumentation
 */

import {BookSecurity, BookProperty, BookPermission} from './typ/book_srv';

export const atom_book = {
	error: {
		plural: 'errors',
		read_only: true,
		connection: 'log',
		security: {
			type: BookSecurity.UNIFORM,
			_r: BookPermission.NOBODY
		},
		properties: {
			status: {
				type: BookProperty.INTEGER,
				label: 'Status'
			},
			msg: {
				type: BookProperty.TEXT,
				label: 'Message'
			},
			error_code: {
				type: BookProperty.TEXT,
				label: 'Error Code'
			},
			error_msg: {
				type: BookProperty.TEXT,
				label: 'Error Message'
			},
			request: {
				type: BookProperty.ATOM,
				label: 'Request',
				atom: 'request',
				delete_cascade: true,
				optional: true
			},
			stack: {
				type: BookProperty.LONG_TEXT,
				label: 'Stack',
				optional: true
			}
		},
		dock:{
			url: '/errors'
		}
	},
	request: {
		plural: 'requests',
		read_only: true,
		connection: 'log',
		security: {
			type: BookSecurity.UNIFORM,
			_r: BookPermission.NOBODY
		},
		properties: {
			full_path: {
				type: BookProperty.TEXT,
				label: "Full path",
			},
			route_path: {
				type: BookProperty.TEXT,
				label: "Route path",
				optional: true
			},
			atom_path: {
				type: BookProperty.TEXT,
				label: "Atom path",
				optional: true
			},
			connection_path: {
				type: BookProperty.TEXT,
				label: "Connection path",
				optional: true
			},
			method: {
				type: BookProperty.ENUM_STRING,
				label: "Method",
				values: ['GET', 'POST', 'DELETE'],
				optional: true,
			},
			atom_name: {
				type: BookProperty.TEXT,
				label: "Atom name",
				optional: true,
				on_error: () => {
					return "generic_atom";
				},
			},
			route_name: {
				type: BookProperty.TEXT,
				label: "Route name",
				optional: true,
			},
			params: {
				type: BookProperty.TEXT,
				label: "Params",
				optional: true,
			},
			query: {
				type: BookProperty.TEXT,
				label: "Query",
				optional: true,
			},
			headers: {
				type: BookProperty.LONG_TEXT,
				label: "Headers",
				optional: true,
			},
			body: {
				type: BookProperty.LONG_TEXT,
				label: "Body",
				optional: true,
			},
			file: {
				type: BookProperty.TEXT,
				label: "File",
				optional: true,
			},
			ip: {
				type: BookProperty.TEXT,
				label: "IP",
				optional: true
			},
			is_auth: {
				type: BookProperty.BINARY,
				label: "Is auth",
				optional: true
			},
			auth_action: {
				type: BookProperty.ENUM_STRING,
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

