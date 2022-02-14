/**
 * Generate module
 *
 * @packageDocumentation
 */

import fs from 'fs';

import core from 'uranio-core';

// import path from 'path';

// import caller from 'caller';

// import {urn_util, urn_exception, urn_log} from 'urn-lib';
import {urn_log} from 'urn-lib';

// const urn_exc = urn_exception.init(`REGISTER_MODULE`, `Register module.`);

import {schema} from '../sch/index';

// import {real_book_property_type} from '../stc/index';

import * as book from '../book/index';

import * as types from '../types';

export function generate():void{
	
	urn_log.debug('Generating uranio api schema...');
	
	core.util.generate();
	
	const atom_book = book.get_all_definitions();
	
	// urn_log.debug(atom_book);
	
	const atom_names:string[] = [];
	const auth_names:string[] = [];
	const log_names:string[] = [];
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		atom_names.push(atom_name);
		if(atom_def.authenticate === true){
			auth_names.push(atom_name);
		}
		if(atom_def.connection === 'log'){
			log_names.push(atom_name);
		}
	}
	
	let txt = '';
	txt += _generate_route_custom_name(atom_book);
	txt += _generate_route_custom_url(atom_book);
	txt += _generate_route_custom_query_param_array(atom_book);
	
	let output_path = '.';
	let base_schema = './schema/index.d.ts';
	for(const argv of process.argv){
		const splitted = argv.split('=');
		if(
			splitted[0] === 'urn_generate_output'
			&& typeof splitted[1] === 'string'
			&& splitted[1] !== ''
		){
			output_path = splitted[1];
		}else if(
			splitted[0] === 'urn_generate_base_schema'
			&& typeof splitted[1] === 'string'
			&& splitted[1] !== ''
		){
			base_schema = splitted[1];
		}
	}
	// const caller_path = caller();
	_replace_text(base_schema, output_path, txt);
	
	urn_log.debug(`API Schema generated.`);
}

function _generate_route_custom_name(atom_book:types.Book){
	let text = '';
	text += `\texport type RouteCustomName<A extends AtomName> =\n`;
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		text += `\t\tA extends '${atom_name}' ? ${_route_custom_name<any>(atom_def)} :\n`;
	}
	text += `\tnever\n\n`;
	return text;
}

function _generate_route_custom_url(atom_book:types.Book){
	let text = '';
	text += `\texport type CustomRouteURL<A extends AtomName, R extends RouteCustomName<A>> =\n`;
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		if(!atom_def.dock || !atom_def.dock.routes){
			text += `\t\tA extends '${atom_name}' ? never :\n`;
		}else{
			text += `\t\tA extends '${atom_name}' ?\n`;
			for(const [route_name, route_def] of Object.entries(atom_def.dock.routes)){
				text += `\t\t\tR extends '${route_name}' ? '${route_def.url}' :\n`;
			}
			text += `\t\t\tnever :\n`;
		}
	}
	text += `\tnever\n\n`;
	return text;
}

function _generate_route_custom_query_param_array(atom_book:types.Book){
	let text = '';
	text += `\texport type CustomRouteQueryParamArray<A extends AtomName, R extends RouteCustomName<A>> =\n`;
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		if(!atom_def.dock || !atom_def.dock.routes){
			text += `\t\tA extends '${atom_name}' ? never :\n`;
		}else{
			text += `\t\tA extends '${atom_name}' ?\n`;
			for(const [route_name, route_def] of Object.entries(atom_def.dock.routes)){
				if(!route_def.query || !Array.isArray(route_def.query)){
					text += `\t\t\tR extends '${route_name}' ? never :\n`;
				}else{
					const joined_value = route_def.query.map((v:string) => `'${v}'`).join(',');
					text += `\t\t\tR extends '${route_name}' ? [${joined_value}] :\n`;
				}
			}
			text += `\t\t\tnever :\n`;
		}
	}
	text += `\tnever\n\n`;
	return text;
}

function _route_custom_name<A extends schema.AtomName>(atom_def:types.Book.Definition<A>){
	if(!atom_def.dock || !atom_def.dock.routes){
		return 'never';
	}
	const route_names = Object.keys(atom_def.dock.routes).map((k) => `'${k}'`);
	return route_names.join(' | ');
}

function _replace_text(base_schema_path:string, output_path:string, txt:string){
	if(!fs.existsSync(output_path)){
		fs.writeFileSync(output_path, '');
	}
	const data = fs.readFileSync(base_schema_path, {encoding: 'utf8'});
	
	const split_text = '\texport {};/** --uranio-generate-end */';
	const data_splitted = data.split(split_text);
	
	let new_data = '';
	new_data += data_splitted[0];
	new_data += txt; + '\n\n\t';
	new_data += split_text;
	new_data += data_splitted[1];
	
	fs.writeFileSync(output_path, new_data);
}

