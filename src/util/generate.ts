/**
 * Generate module
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

import {urn_log} from 'urn-lib';

import {schema as schema_types} from '../sch/index';

import * as book from '../book/index';

import * as types from '../types';

import {default_routes} from '../routes/client';

export let process_params = {
	urn_command: `schema`,
	urn_base_schema: `./.uranio/generate/base/schema.d.ts`,
	urn_output_dir: `.`
};

export function schema():string{
	urn_log.debug('Started generating uranio api schema...');
	init();
	const core_schema = core.util.generate.schema();
	const text = _generate_uranio_schema_text(core_schema);
	urn_log.debug(`API Schema generated.`);
	return text;
}

export function schema_and_save():void{
	const text = schema();
	save_schema(text);
	urn_log.debug(`Schema generated and saved.`);
}

export function save_schema(text:string):void{
	return core.util.generate.save_schema(text);
}

export function init():void{
	core.util.generate.init();
	process_params = core.util.generate.process_params;
}

function _generate_uranio_schema_text(core_schema:string){
	const txt = _generate_api_schema_text();
	const split_text = '\texport {};/** --uranio-generate-end */';
	const data_splitted = core_schema.split(split_text);
	let new_data = '';
	new_data += data_splitted[0];
	new_data += txt; + '\n\n\t';
	new_data += split_text;
	new_data += data_splitted[1];
	return new_data;
}

function _generate_api_schema_text(){
	const atom_book = book.get_all_definitions();
	let txt = '';
	txt += _generate_route_name(atom_book);
	txt += _generate_route_url(atom_book);
	txt += _generate_route_query_param(atom_book);
	return txt;
}

function _generate_route_query_param(atom_book:types.Book){
	let text = '';
	text += _generate_route_default_query_param();
	text += _generate_route_custom_query_param(atom_book);
	text += `\texport type RouteQueryParam<A extends AtomName, `;
	text += `R extends RouteName<A>> =\n`;
	text += `\t\tR extends RouteDefaultName ? DefaultRouteQueryParam<R> :\n`;
	text += `\t\tR extends RouteCustomName<A> ?\n`;
	text += `\t\tCustomRouteQueryParam<A,R> extends string ? CustomRouteQueryParam<A,R> :\n`;
	text += `\t\tnever :\n`;
	text += `\t\tnever\n`;
	text += `\n`;
	return text;
}

function _generate_route_default_query_param(){
	let text = '';
	text += `\ttype DefaultRouteQueryParam<R extends RouteDefaultName> =\n`;
	for(const [key, value] of Object.entries(default_routes)){
		const route_def = value as types.Book.Definition.Dock.Routes.Route<'superuser', 'find'>;
		if(!route_def.query){
			text += `\t\tR extends '${key}' ? never :\n`;
		}else{
			const params_union = route_def.query.map((v) => `'${v}'`).join(' | ');
			text += `\t\tR extends '${key}' ? ${params_union} :\n`;
		}
	}
	text += `\t\tnever\n`;
	text += `\n`;
	return text;
}

function _generate_route_url(atom_book:types.Book){
	let text = '';
	text += _generate_route_default_url();
	text += _generate_route_custom_url(atom_book);
	text += `\texport type RouteURL<A extends AtomName, R extends RouteName<A>> =\n`;
	text += `\t\tR extends RouteCustomName<A> ? CustomRouteURL<A,R> :\n`;
	text += `\t\tR extends RouteName<A> ? DefaultRouteURL<A,R> :\n`;
	text += `\t\tnever\n`;
	text += `\n`;
	return text;
}

function _generate_route_default_url(){
	let text = '';
	text += `\ttype DefaultRouteURL<A extends AtomName, R extends RouteName<A>> =\n`;
	for(const [key, val] of Object.entries(default_routes)){
		text += `\t\tR extends '${key}' ? '${val.url}' :\n`;
	}
	text += `\t\tnever\n`;
	text += `\n`;
	return text;
}

function _generate_route_name(atom_book:types.Book){
	let text = '';
	text += _generate_route_default_name();
	text += _generate_route_custom_name(atom_book);
	text += `\texport type RouteName<A extends AtomName> =\n`;
	text += `\t\tRouteCustomName<A> | RouteDefaultName;\n\n`;
	return text;
}

function _generate_route_default_name(){
	const default_route_keys = Object.keys(default_routes);
	let text = '';
	text += `\ttype RouteDefaultName = `;
	text += default_route_keys.map((k) => `'${k}'`).join(' | ');
	text += `\n\n`;
	return text;
}

function _generate_route_custom_name(atom_book:types.Book){
	let text = '';
	text += `\ttype RouteCustomName<A extends AtomName> =\n`;
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		text += `\t\tA extends '${atom_name}' ? ${_route_custom_name<any>(atom_def)} :\n`;
	}
	text += `\tnever\n\n`;
	return text;
}

function _generate_route_custom_url(atom_book:types.Book){
	let text = '';
	text += `\ttype CustomRouteURL<A extends AtomName, R extends RouteCustomName<A>> =\n`;
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

function _generate_route_custom_query_param(atom_book:types.Book){
	let text = '';
	text += `\ttype CustomRouteQueryParam<A extends AtomName, R extends RouteCustomName<A>> =\n`;
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		if(!atom_def.dock || !atom_def.dock.routes){
			text += `\t\tA extends '${atom_name}' ? never :\n`;
		}else{
			text += `\t\tA extends '${atom_name}' ?\n`;
			for(const [route_name, route_def] of Object.entries(atom_def.dock.routes)){
				if(!route_def.query || !Array.isArray(route_def.query)){
					text += `\t\t\tR extends '${route_name}' ? never :\n`;
				}else{
					const joined_value = route_def.query.map((v:string) => `'${v}'`).join(' | ');
					text += `\t\t\tR extends '${route_name}' ? ${joined_value} :\n`;
				}
			}
			text += `\t\t\tnever :\n`;
		}
	}
	text += `\tnever\n\n`;
	return text;
}

function _route_custom_name<A extends schema_types.AtomName>(atom_def:types.Book.Definition<A>){
	if(!atom_def.dock || !atom_def.dock.routes){
		return 'never';
	}
	const route_names = Object.keys(atom_def.dock.routes).map((k) => `'${k}'`);
	return route_names.join(' | ');
}

