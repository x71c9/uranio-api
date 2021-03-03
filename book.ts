
import urn_core from 'urn_core';

export const web_atom_book = {
	...urn_core.types.required_book,
	error: {
		connection: 'log',
		security: {
			type: urn_core.types.BookSecurityType.UNIFORM,
			_r: urn_core.types.BookPermissionType.NOBODY
		},
		api:{
			url: 'errors'
		},
		properties: {
			status: {
				type: urn_core.types.BookPropertyType.INTEGER,
				label: 'Status'
			},
			msg: {
				type: urn_core.types.BookPropertyType.TEXT,
				label: 'Message'
			},
			error_code: {
				type: urn_core.types.BookPropertyType.TEXT,
				label: 'Error Code'
			},
			error_msg: {
				type: urn_core.types.BookPropertyType.TEXT,
				label: 'Error Message'
			},
			request: {
				type: urn_core.types.BookPropertyType.ATOM,
				label: 'Request',
				atom: 'request',
				delete_cascade: true,
				optional: true
			},
			stack: {
				type: urn_core.types.BookPropertyType.LONG_TEXT,
				label: 'Stack',
				optional: true
			}
		}
	},
	request: {
		connection: 'log',
		security: {
			type: urn_core.types.BookSecurityType.UNIFORM,
			_r: urn_core.types.BookPermissionType.NOBODY
		},
		api:{
			url: 'requests'
		},
		properties: {
			url: {
				type: urn_core.types.BookPropertyType.TEXT,
				label: 'URL'
			},
			ip: {
				type: urn_core.types.BookPropertyType.TEXT,
				label: 'IP'
			},
			params: {
				type: urn_core.types.BookPropertyType.TEXT,
				label: 'Params',
				optional: true
			},
			query: {
				type: urn_core.types.BookPropertyType.TEXT,
				label: 'Query',
				optional: true
			},
			body: {
				type: urn_core.types.BookPropertyType.LONG_TEXT,
				label: 'Body',
				optional: true
			},
			atom_name: {
				type: urn_core.types.BookPropertyType.TEXT,
				label: 'Atom name',
				on_error: () => {return 'generic_atom';}
			},
			auth_action: {
				type: urn_core.types.BookPropertyType.ENUM_STRING,
				label: 'Auth action',
				values: ['READ', 'WRITE'],
				on_error: () => {return 'READ';}
			}
		}
	},
} as const;
