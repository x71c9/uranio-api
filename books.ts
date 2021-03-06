
import urn_core from '../urn-core/';

export const atom = {
	...urn_core.types.required_books.atom,
	error: {
		connection: 'log',
		security: {
			type: urn_core.types.BookSecurityType.UNIFORM,
			_r: urn_core.types.BookPermissionType.NOBODY
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

export const bll = {
	...urn_core.types.required_books.bll,
	error: {},
	request: {}
} as const;

export const api = {
	...urn_core.types.required_books.api,
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

