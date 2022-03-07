/**
 * Conf module
 *
 * @packageDocumentation
 */

import {urn_util, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('API_ENV_CLIENT_MODULE', `Api client environment module`);

import core_client from 'uranio-core/client';

import {api_client_env} from '../client/default_env';

export {api_client_env as defaults};

import * as types from '../client/types';

let _is_api_client_initialized = false;

export function get<k extends keyof Required<types.ClientEnvironment>>(param_name:k)
		:typeof api_client_env[k]{
	_check_if_uranio_was_initialized();
	_check_if_param_exists(param_name);
	return api_client_env[param_name];
}

export function is_initialized()
		:boolean{
	return core_client.conf.is_initialized() && _is_api_client_initialized;
}

export function set_initialize(is_initialized:boolean)
		:void{
	_is_api_client_initialized = is_initialized;
}

export function set_from_env(repo_env:Required<types.ClientEnvironment>)
		:void{
	core_client.env.set_from_env(repo_env);
	const conf = _get_env_vars(repo_env);
	set(repo_env, conf);
}

export function set(
	repo_env: Required<types.ClientEnvironment>,
	config: Partial<types.ClientEnvironment>
):void{
	return core_client.env.set(repo_env, config);
}

function _get_env_vars(repo_env:types.ClientEnvironment):types.ClientEnvironment{
	// if(typeof process.env.URN_PREFIX_LOG === 'string' && process.env.URN_PREFIX_LOG !== ''){
	//   repo_env.prefix_log = process.env.URN_PREFIX_LOG;
	// }
	return repo_env;
}

function _check_if_param_exists(param_name:string){
	return urn_util.object.has_key(api_client_env, param_name);
}

function _check_if_uranio_was_initialized(){
	if(is_initialized() === false){
		throw urn_exc.create_not_initialized(
			`NOT_INITIALIZED`,
			`Uranio was not initialized. Please run \`uranio.init()\` in your main file.`
		);
	}
}
