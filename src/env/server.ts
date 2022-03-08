/**
 * Env module
 *
 * @packageDocumentation
 */

import {urn_util, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('API_ENV_MODULE', `Api environment module`);

import core from 'uranio-core';

import {api_env} from './defaults';

export {api_env as defaults};

import * as types from '../server/types';

let _is_api_initialized = false;

export function get<k extends keyof types.Environment>(param_name:k)
		:typeof api_env[k]{
	_check_if_uranio_was_initialized();
	_check_if_param_exists(param_name as string);
	return api_env[param_name];
}

export function get_current<k extends keyof types.Environment>(param_name:k)
		:typeof api_env[k]{
	// const pro_value = get(param_name);
	// if(is_production()){
	//   return pro_value;
	// }
	// if(param_name.indexOf('service_') !== -1){
	//   const dev_param = param_name.replace('service_', 'service_dev_');
	//   const dev_value = get(dev_param as keyof types.Environment);
	//   if(typeof dev_value !== 'undefined'){
	//     return dev_value as typeof api_env[k];
	//   }
	// }
	// return pro_value;
	return core.env.get_current(param_name);
}

export function is_initialized():boolean{
	return core.env.is_initialized() && _is_api_initialized;
}

export function set_initialize(is_initialized:boolean):void{
	_is_api_initialized = is_initialized;
}

export function set_from_env(repo_env:Required<types.Environment>)
		:void{
	return core.env.set_from_env(repo_env);
}

export function set(
	repo_env: Required<types.Environment>,
	config: Partial<types.Environment>
):void{
	return core.env.set(repo_env, config);
}

export function is_production():boolean{
	return core.env.is_production();
}

function _check_if_param_exists(param_name:string){
	return urn_util.object.has_key(api_env, param_name);
}

function _check_if_uranio_was_initialized(){
	if(is_initialized() === false){
		throw urn_exc.create_not_initialized(
			`NOT_INITIALIZED`,
			`Uranio was not initialized. Please run \`uranio.init()\` in your main file.`
		);
	}
}
