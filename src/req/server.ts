/**
 * Required module
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

import * as conf from '../conf/server';

import {required_atoms} from './atoms';

import * as types from '../client/types';

export function get():types.Book{
	if(conf.get('default_atoms_request') === false){
		delete (required_atoms as any)._request;
	}
	if(conf.get('default_atoms_error') === false){
		delete (required_atoms as any)._error;
	}
	return {
		...core.required.get(),
		...required_atoms
	} as unknown as types.Book;
}
