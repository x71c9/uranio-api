/**
 * Init module
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('INIT_API_MODULE', `Api init module`);

import core from 'uranio-core';

import {api_config} from '../conf/defaults';

// import {default_routes} from '../routes/client';

import * as register from '../reg/server';

import {atom_book} from '../atoms';

import {schema} from '../sch/server';

import * as types from '../server/types';

import * as conf from '../conf/server';

import * as book from '../book/server';

import * as log from '../log/server';

import {return_default_routes} from '../routes/calls';

export function init(config?:types.Configuration)
		:void{
	
	log.init(urn_log.defaults);
	
	core.init(config);
	
	_add_default_routes();
	_register_required_atoms();
	
	if(typeof config === 'undefined'){
		core.conf.set_from_env(api_config);
	}else{
		core.conf.set(api_config, config);
	}
	
	_validate_api_variables();
	_validate_api_book();
	
	if(config && typeof config.log_level === 'number'){
		urn_log.defaults.log_level = config.log_level;
	}
	
	conf.set_initialize(true);
}

function _add_default_routes(){
	const core_atom_book = book.get_all_definitions();
	for(const [atom_name, atom_def] of Object.entries(core_atom_book)){
		(atom_def.dock as any).routes = return_default_routes(atom_name as schema.AtomName);
	}
}
function _register_required_atoms(){
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		(atom_def.dock as any).routes = return_default_routes(atom_name as schema.AtomName);
		register.atom(atom_def as any, atom_name as schema.AtomName);
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
	const atom_book = book.get_all_definitions();
	const urls:string[] = [];
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
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
	const atom_book = book.get_all_definitions();
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
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
//   const atom_book = book.get_all_definitions();
//   const invalid_route_names:string[] = _get_default_route_name();
//   for(const [_atom_name, atom_def] of Object.entries(atom_book)){
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
