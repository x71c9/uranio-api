/**
 * Required module
 *
 * @packageDocumentation
 */

import core_client from 'uranio-core/client';

import * as conf from '../conf/client';

import {required_atoms} from './atoms';

import * as types from '../server/types';

export function get():types.Book{
	if(conf.get('default_atoms_request') === false){
		delete (required_atoms as any).request;
	}
	if(conf.get('default_atoms_error') === false){
		delete (required_atoms as any).error;
	}
	return {
		...core_client.required.get(),
		...required_atoms
	} as unknown as types.Book;
}
