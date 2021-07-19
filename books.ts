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
			url: {
				type: uranio.types.BookPropertyType.TEXT,
				label: 'URL'
			},
			ip: {
				type: uranio.types.BookPropertyType.TEXT,
				label: 'IP'
			},
			params: {
				type: uranio.types.BookPropertyType.TEXT,
				label: 'Params',
				optional: true
			},
			query: {
				type: uranio.types.BookPropertyType.TEXT,
				label: 'Query',
				optional: true
			},
			body: {
				type: uranio.types.BookPropertyType.LONG_TEXT,
				label: 'Body',
				optional: true
			},
			atom_name: {
				type: uranio.types.BookPropertyType.TEXT,
				label: 'Atom name',
				on_error: () => {return 'generic_atom';}
			},
			auth_action: {
				type: uranio.types.BookPropertyType.ENUM_STRING,
				label: 'Auth action',
				values: ['READ', 'WRITE', 'AUTH'],
				on_error: () => {return 'READ';}
			}
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

