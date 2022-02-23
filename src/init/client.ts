/**
 * Init module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import core_client from 'uranio-core/client';

import {api_client_config} from '../cln/defaults';

import {register} from '../reg/client';

import {atom_book} from '../atoms';

import * as types from '../cln/types';

import * as conf from '../conf/client';

import * as log from '../log/client';

export function init(config?:types.ClientConfiguration)
		:void{
	
	log.init(urn_log.defaults);
	
	core_client.init(config);
	
	_register_required_atoms();
	
	if(!config){
		conf.set_from_env(api_client_config);
	}else{
		conf.set(api_client_config, config);
	}
	
	if(config && typeof config.log_level === 'number'){
		urn_log.defaults.log_level = config.log_level;
	}
	
	conf.set_initialize(true);
}

function _register_required_atoms(){
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		register(atom_def as any, atom_name as any);
	}
}

