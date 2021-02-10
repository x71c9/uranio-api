
import * as book_types from './types';

import {core_atom_book} from 'urn_core/book';

export const web_atom_book = {
	log: {
		connection: 'log',
		security: {
			type: book_types.BookSecurityType.UNIFORM,
			_r: null
		},
		api:{
			url: '/log'
		},
		properties: {
			...core_atom_book.log.properties,
			path: {
				type: book_types.BookPropertyType.TEXT,
				label: 'Path',
				optional: true
			},
			ip: {
				type: book_types.BookPropertyType.TEXT,
				label: 'IP',
				optional: true
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
