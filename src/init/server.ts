/**
 * Init module
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('INIT_API_MODULE', `Api init module`);

import core from 'uranio-core';

import {api_config} from '../conf/defaults';

import * as register from '../reg/server';

import * as required from '../req/server';

import * as types from '../server/types';

import * as conf from '../conf/server';

import * as book from '../book/server';

import * as log from '../log/server';

export function init(config?:types.Configuration, register_required=true)
		:void{
	
	log.init(urn_log.defaults);
	
	core.init(config, false);
	
	core.conf.set_from_env(api_config);
	if(config){
		core.conf.set(api_config, config);
	}
	
	if(register_required){
		_register_required_atoms();
	}
	
	_validate_api_variables();
	_validate_api_book();
	
	conf.set_initialize(true);
	
	urn_log.defaults.log_level = conf.get(`log_level`);
	
}

function _register_required_atoms(){
	const required_atoms = required.get();
	for(const [atom_name, atom_def] of Object.entries(required_atoms)){
		register.atom(atom_def as any, atom_name);
	}
}

/**
 * NOTE:
 * Maybe this should be before compilation and not at runtime?
 */
function _validate_api_book(){
	_validate_dock_url_uniqueness();
	_validate_dock_route_url_uniqueness();
	// _validate_route_name();
}

function _validate_dock_url_uniqueness(){
	const required_atoms = book.get_all_definitions();
	const urls:string[] = [];
	for(const [atom_name, atom_def] of Object.entries(required_atoms)){
		const dock_def = atom_def.dock;
		if(dock_def && typeof dock_def.url === 'string'){
			if(urls.includes(dock_def.url)){
				throw urn_exc.create_not_initialized(
					`INVALID_BOOK_DOCK_URL`,
					`Ivalid dock url value [${dock_def.url}]. Url already in use.` +
					` atom_name [${atom_name}]`
				);
			}
			urls.push(dock_def.url);
		}
	}
}

function _validate_dock_route_url_uniqueness(){
	const required_atoms = book.get_all_definitions();
	for(const [atom_name, atom_def] of Object.entries(required_atoms)){
		const dock_def = atom_def.dock;
		if(dock_def && dock_def.routes){
			const route_urls:{[k:string]:string[]} = {};
			for(const [_route_name, route_def] of Object.entries(dock_def.routes)){
				if(typeof route_def.url === 'string'){
					if(!route_urls[route_def.method]){
						route_urls[route_def.method] = [];
					}
					if(route_urls[route_def.method].includes(route_def.url)){
						throw urn_exc.create_not_initialized(
							`INVALID_BOOK_ROUTE_URL`,
							`Ivalid dock route url value [${route_def.url}]. Url already in use.` +
							` atom_name [${atom_name}]`
						);
					}
					route_urls[route_def.method].push(route_def.url);
				}
			}
		}
	}
}

// function _validate_route_name(){
//   const required_atoms = book.get_all_definitions();
//   const invalid_route_names:string[] = _get_default_route_name();
//   for(const [_atom_name, atom_def] of Object.entries(required_atoms)){
//     const dock_def = atom_def.dock;
//     if(dock_def && typeof dock_def.routes === 'object'){
//       for(const [route_name, _route_def] of Object.entries(dock_def.routes)){
//         if(invalid_route_names.includes(route_name)){
//           throw urn_exc.create_not_initialized(
//             `INVALID_BOOK_ROUTE_NAME`,
//             `Ivalid route name [${route_name}].` +
//             ` Route name already in use by the system.`
//           );
//         }
//       }
//     }
//   }
// }

// function _get_default_route_name(){
//   const route_names:string[] = [];
//   for(const route_name in default_routes){
//     route_names.push(route_name);
//   }
//   route_names.push('upload');
//   route_names.push('presigned');
//   return route_names;
// }

function _validate_api_variables(){
	_check_number_values();
}

function _check_number_values(){
	if(api_config.request_auto_limit < 0){
		throw urn_exc.create_not_initialized(
			`INVALID_REQUEST_AUTO_LIMIT`,
			`Config request_auto_limit value cannot be smaller than 0.`
		);
	}
	if(api_config.service_port < 0){
		throw urn_exc.create_not_initialized(
			`INVALID_SERVIE_PORT`,
			`Config service_port value cannot be smaller than 0.`
		);
	}
}
