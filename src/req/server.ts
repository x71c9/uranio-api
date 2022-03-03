/**
 * Required module
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

import {required_atoms} from './atoms';

import * as types from '../client/types';

export function get():types.Book{
	return {
		...core.required.get(),
		...required_atoms
	} as unknown as types.Book;
}
