
import * as book_types from './types';

import {core_atom_book} from 'urn_core/book';

export const web_atom_book = {
	error: {
		connection: 'log',
		security: {
			type: book_types.BookSecurityType.UNIFORM,
			_r: book_types.BookPermissionType.NOBODY
		},
		api:{
			url: '/errors'
		},
		properties: {
			status: {
				type: book_types.BookPropertyType.INTEGER,
				label: 'Status'
			},
			msg: {
				type: book_types.BookPropertyType.TEXT,
				label: 'Message'
			},
			error_code: {
				type: book_types.BookPropertyType.TEXT,
				label: 'Error Code'
			},
			error_msg: {
				type: book_types.BookPropertyType.TEXT,
				label: 'Error Message'
			},
			request: {
				type: book_types.BookPropertyType.ATOM,
				label: 'Request',
				atom: 'request',
				delete_cascade: true,
				optional: true
			},
			stack: {
				type: book_types.BookPropertyType.LONG_TEXT,
				label: 'Stack',
				optional: true
			}
		}
	},
	request: {
		connection: 'log',
		security: {
			type: book_types.BookSecurityType.UNIFORM,
			_r: book_types.BookPermissionType.NOBODY
		},
		api:{
			url: '/requests'
		},
		properties: {
			url: {
				type: book_types.BookPropertyType.TEXT,
				label: 'URL'
			},
			ip: {
				type: book_types.BookPropertyType.TEXT,
				label: 'IP'
			},
			params: {
				type: book_types.BookPropertyType.TEXT,
				label: 'Params',
				optional: true
			},
			query: {
				type: book_types.BookPropertyType.TEXT,
				label: 'Query',
				optional: true
			},
			body: {
				type: book_types.BookPropertyType.LONG_TEXT,
				label: 'Body',
				optional: true
			},
			atom_name: {
				type: book_types.BookPropertyType.TEXT,
				label: 'Atom name',
				on_error: () => {return 'generic_atom';}
			},
			auth_action: {
				type: book_types.BookPropertyType.ENUM_STRING,
				label: 'Auth action',
				values: ['READ', 'WRITE'],
				on_error: () => {return 'READ';}
			}
		}
	},
	superuser: {...core_atom_book.superuser},
	user: {...core_atom_book.user},
	group: {...core_atom_book.group}
} as const;

export const atom_book = {
	...web_atom_book,
} as const;
