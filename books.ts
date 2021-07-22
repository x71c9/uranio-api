/**
 * Required api books
 *
 * @packageDocumentation
 */

import uranio from 'uranio';

export const atom = {
	error: {
		connection: 'log',
		security: {
			type: uranio.types.BookSecurityType.UNIFORM,
			_r: uranio.types.BookPermissionType.NOBODY
		},
		properties: {
			status: {
				type: uranio.types.BookPropertyType.INTEGER,
				label: 'Status'
			},
			msg: {
				type: uranio.types.BookPropertyType.TEXT,
				label: 'Message'
			},
			error_code: {
				type: uranio.types.BookPropertyType.TEXT,
				label: 'Error Code'
			},
			error_msg: {
				type: uranio.types.BookPropertyType.TEXT,
				label: 'Error Message'
			},
			request: {
				type: uranio.types.BookPropertyType.ATOM,
				label: 'Request',
				atom: 'request',
				delete_cascade: true,
				optional: true
			},
			stack: {
				type: uranio.types.BookPropertyType.LONG_TEXT,
				label: 'Stack',
				optional: true
			}
		}
	},
	request: {
		connection: 'log',
		security: {
			type: uranio.types.BookSecurityType.UNIFORM,
			_r: uranio.types.BookPermissionType.NOBODY
		},
		properties: {
			full_path: {
				type: uranio.types.BookPropertyType.TEXT,
				label: "Full path",
			},
			route_path: {
				type: uranio.types.BookPropertyType.TEXT,
				label: "Route path",
			},
			atom_path: {
				type: uranio.types.BookPropertyType.TEXT,
				label: "Atom path",
			},
			connection_path: {
				type: uranio.types.BookPropertyType.TEXT,
				label: "Connection path",
			},
			method: {
				type: uranio.types.BookPropertyType.ENUM_STRING,
				label: "Method",
				values: ['GET', 'POST', 'DELETE']
			},
			atom_name: {
				type: uranio.types.BookPropertyType.TEXT,
				label: "Atom name",
				on_error: () => {
					return "generic_atom";
				},
			},
			route_name: {
				type: uranio.types.BookPropertyType.TEXT,
				label: "Route name",
			},
			params: {
				type: uranio.types.BookPropertyType.TEXT,
				label: "Params",
				optional: true,
			},
			query: {
				type: uranio.types.BookPropertyType.TEXT,
				label: "Query",
				optional: true,
			},
			headers: {
				type: uranio.types.BookPropertyType.LONG_TEXT,
				label: "Headers",
				optional: true,
			},
			body: {
				type: uranio.types.BookPropertyType.LONG_TEXT,
				label: "Body",
				optional: true,
			},
			ip: {
				type: uranio.types.BookPropertyType.TEXT,
				label: "IP",
				optional: true
			},
			is_auth: {
				type: uranio.types.BookPropertyType.BINARY,
				label: "Is auth",
				optional: true
			},
			auth_action: {
				type: uranio.types.BookPropertyType.ENUM_STRING,
				label: "Auth action",
				values: ["READ", "WRITE", "AUTH"],
				on_error: () => {
					return "READ";
				},
			},
		}
	},
} as const;

export const bll = {
	error: {},
	request: {}
} as const;

export const api = {
	error: {
		api:{
			url: 'errors'
		}
	},
	request: {
		api:{
			url: 'requests'
		}
	}
} as const;

