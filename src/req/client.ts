/**
 * Required module
 *
 * @packageDocumentation
 */

import core_client from 'uranio-core/client';

import {required_atoms} from './atoms';

import * as types from '../server/types';

export function get():types.Book{
	return {
		...core_client.required.get(),
		...required_atoms
	} as unknown as types.Book;
}
