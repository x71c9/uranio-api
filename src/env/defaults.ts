/**
 * Module for default environment object
 *
 * @packageDocumentation
 */

import {Environment} from '../server/types';

import core from 'uranio-core';

export const api_env:Required<Environment> = {
	
	...core.env.get_all(),
	
	https: true,
	
	ssl_certificate: '',
	
	ssl_key: ''
	
};
