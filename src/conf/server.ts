/**
 * Conf module
 *
 * @packageDocumentation
 */

import {urn_util, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('CONF_API_MODULE', `Api configuration module`);

import core from 'uranio-core';

import {api_config} from './defaults';

export {api_config as defaults};

import * as types from '../server/types';

let _is_api_initialized = false;

export function get<k extends keyof types.Configuration>(param_name:k)
		:typeof api_config[k]{
	_check_if_uranio_was_initialized();
	_check_if_param_exists(param_name);
	return api_config[param_name];
}

export function is_initialized():boolean{
	return core.conf.is_initialized() && _is_api_initialized;
}

export function set_initialize(is_initialized:boolean):void{
	_is_api_initialized = is_initialized;
}

// export function set_from_env(repo_config:Required<types.Configuration>)
//     :void{
//   return core.conf.set_from_env(repo_config);
// }

export function set(
	repo_config: Required<types.Configuration>,
	config: Partial<types.Configuration>
):void{
	return core.conf.set(repo_config, config);
}

function _check_if_param_exists(param_name:string){
	return urn_util.object.has_key(api_config, param_name);
}

function _check_if_uranio_was_initialized(){
	if(is_initialized() === false){
		throw urn_exc.create_not_initialized(
			`NOT_INITIALIZED`,
			`Uranio was not initialized. Please run \`uranio.init()\` in your main file.`
		);
	}
}
