/**
 * Init module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import core_client from 'uranio-core/client';

import {api_client_config} from '../client/defaults';

import * as register from '../reg/client';

import {atom_book} from '../atoms';

import * as types from '../client/types';

import * as conf from '../conf/client';

import * as log from '../log/client';

import * as book from '../book/client';

import {default_routes, media_routes} from '../routes/client';

import {default_atom_names} from '../atoms';

export function init(config?:types.ClientConfiguration)
		:void{
	
	log.init(urn_log.defaults);
	
	core_client.init(config);
	
	_add_default_routes();
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

function _add_default_routes(){
	
	const core_atom_book = book.get_all_definitions();
	for(const [atom_name, atom_def] of Object.entries(core_atom_book)){
		if(atom_name === 'media'){
			(atom_def.dock as any).routes = {
				...default_routes,
				...media_routes
			};
		}else if(default_atom_names.includes(atom_name)){
			(atom_def.dock as any).routes = default_routes;
		}
		register.atom(atom_def as any, atom_name as any);
	}
}

function _register_required_atoms(){
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		if(atom_name === 'media'){
			(atom_def.dock as any).routes = {
				...default_routes,
				...media_routes
			};
		}else{
			(atom_def.dock as any).routes = default_routes;
		}
		register.atom(atom_def as any, atom_name as any);
	}
}

