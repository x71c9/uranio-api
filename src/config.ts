/**
 * Configuration module
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception} from 'urn-lib';

import urn_core from 'urn-core';

import {Configuration} from './types';

const urn_exc = urn_exception.init('WEB-CONFIG', 'Web Configuration module');

export function get_core_config()
		:urn_core.Configuration {
	
	const process_core_vars = [
		'urn_db_host',
		'urn_db_port',
		'urn_db_name',
		'urn_db_trash_name',
		'urn_db_log_name',
		'urn_log_level'
	];

	_check_variables(process_core_vars);
	
	const config:urn_core.Configuration = {
		
		db_host: process.env.urn_db_host!,
		
		db_port: parseInt(process.env.urn_db_port!),
		
		db_name: process.env.urn_db_name!,
		
		db_trash_name: process.env.urn_db_trash_name!,
		
		db_log_name: process.env.urn_db_log_name!,
		
		db_type: process.env.urn_db_type! as any,
		
		log_level: urn_log.defaults.log_level
		
	};
	
	return config;
	
}

export function get_web_config()
		:Configuration{
	
	const process_web_vars = [
		'ws_port'
	]
	
	_check_variables(process_web_vars);
	
	const config:Configuration = {
		
		ws_port: parseInt(process.env.ws_port!)
		
	}
	
	return config;
	
}

function _check_variables(variables:string[])
	:void{
	
	for(const v of variables){
		if(!process.env[v])
			throw urn_exc.create('GCN', `Environment variable [${v}] is nullish.`);
	}
	
}
