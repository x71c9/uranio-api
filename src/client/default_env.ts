/**
 * Module for default client configuration object
 *
 * @packageDocumentation
 */

import core_client from 'uranio-core/client';

import {ClientEnvironment} from './types';

/**
 * IMPORTANT: if new variable are added here they must be added on
 * uranio-trx/conf/client.ts
 *
 * Unfortunately the browser doesn't allow to dynamically access process.env
 * variable, like process.env[var_name] where `var_name` is a variable.
 */
export const api_client_env:Required<ClientEnvironment> = {
	
	...core_client.env.defaults,
	
};
