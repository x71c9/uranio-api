/**
 * Generate module
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

import {urn_log} from 'urn-lib';

import {schema as schema_types} from '../sch/server';

import * as book from '../book/server';

import * as types from '../server/types';

import {default_routes} from '../routes/client';

import {ClientConfiguration} from '../typ/conf_cln';

// import * as conf from '../conf/server';

// const required_server_config_client:Array<keyof types.Configuration> = [
//   'service_protocol',
//   'service_domain',
//   'service_port',
//   'dev_service_protocol',
//   'dev_service_domain',
//   'dev_service_port',
// ];

export let process_params = {
	urn_command: `schema`
};

export function schema():string{
	urn_log.trace('Started generating uranio api schema...');
	init();
	const core_schema = core.util.generate.schema();
	const text = _generate_uranio_schema_text(core_schema);
	urn_log.trace(`API Schema generated.`);
	return text;
}

export function schema_and_save():void{
	const text = schema();
	save_schema(text);
	urn_log.trace(`Schema generated and saved.`);
}

export function save_schema(text:string):void{
	return core.util.generate.save_schema(text);
}

export function init():void{
	core.util.generate.init();
	process_params = core.util.generate.process_params;
}

export function client_config(client_default:Required<ClientConfiguration>):string{
	urn_log.trace('Started generating uranio api client config...');
	init();
	// const all_server_conf = conf.get_all();
	// for(const reqkey of required_server_config_client){
	//   (client_default as any)[`__server_${reqkey}`] = all_server_conf[reqkey];
	// }
	const text = core.util.generate.client_config(client_default);
	urn_log.trace(`Api client config generated.`);
	return text;
}

export function client_config_and_save(client_default:Required<ClientConfiguration>):void{
	const text = client_config(client_default);
	save_client_config(text);
	urn_log.trace(`Api Client config generated and saved.`);
}

export function save_client_config(text:string):void{
	core.util.generate.save_client_config(text);
}

function _generate_uranio_schema_text(core_schema:string){
	const txt = _generate_api_schema_text();
	const split_text = 'export {};/** --uranio-generate-end */';
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
	
	txt += `\n`;
	txt += `import {urn_response} from 'urn-lib';\n`;
	txt += _generate_call_response(atom_book);
	// txt += _generate_api_response(atom_book);
	txt += _generate_api_response();
	return txt;
}

function _generate_call_response(atom_book:types.Book){
	return _return_generic_response(atom_book, 'CallResponse', false);
}

function _generate_api_response(){
// function _generate_api_response(atom_book:types.Book){
	// return _return_generic_response(atom_book, 'ApiResponse', true);
	let text = '';
	text += `\nexport declare type ApiResponse<A extends AtomName, R extends RouteName<A>, D extends Depth = 0> = urn_response.General<CallResponse<A,R,D>>`;
	text += `\n`;
	text += `\n`;
	return text;
}

function _return_generic_response(atom_book:types.Book, type_name: string, response_wrapper=false){
	let text = '';
	text += `\nexport declare type ${type_name}<A extends AtomName, R extends RouteName<A>, D extends Depth = 0> =\n`;
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		text += `\tA extends '${atom_name}' ?\n`;
		if(!atom_def.dock || !atom_def.dock.routes){
			text += `\t\tnever :\n`;
		}else{
			const routes = atom_def.dock.routes as types.Book.Definition.Dock.Routes<'superuser'>;
			for(const [route_name, route_def] of Object.entries(routes)){
				text += `\t\tR extends '${route_name}' ? ${_return_response_return(route_def.return, response_wrapper)} :\n`;
			}
			text += `\t\tnever :\n`;
		}
	}
	text += `\tnever\n`;
	text += `\n`;
	return text;
}

function _return_response_return(return_type:string|undefined, response_wrapper=false){
	if(response_wrapper === false){
		return return_type;
	}
	return `urn_response.General<${return_type}, any>`;
}

function _generate_route_query_param(atom_book:types.Book){
	let text = '';
	// text += _generate_route_default_query_param();
	text += _generate_route_custom_query_param(atom_book);
	// text += `export declare type RouteQueryParam<A extends AtomName, `;
	// text += `R extends RouteName<A>> =\n`;
	// text += `\tR extends RouteDefaultName ? DefaultRouteQueryParam<R> :\n`;
	// text += `\tR extends RouteCustomName<A> ?\n`;
	// text += `\tCustomRouteQueryParam<A,R> extends string ? CustomRouteQueryParam<A,R> :\n`;
	// text += `\tnever :\n`;
	// text += `\tnever\n`;
	text += `\n`;
	return text;
}

// function _generate_route_default_query_param(){
//   let text = '';
//   text += `declare type DefaultRouteQueryParam<R extends RouteDefaultName> =\n`;
//   for(const [key, value] of Object.entries(default_routes)){
//     const route_def = value as types.Book.Definition.Dock.Routes.Route<'superuser', 'find'>;
//     if(!route_def.query){
//       text += `\tR extends '${key}' ? never :\n`;
//     }else{
//       const params_union = route_def.query.map((v) => `'${v}'`).join(' | ');
//       text += `\tR extends '${key}' ? ${params_union} :\n`;
//     }
//   }
//   text += `\tnever\n`;
//   text += `\n`;
//   return text;
// }

function _generate_route_url(atom_book:types.Book){
	let text = '';
	// text += _generate_route_default_url();
	text += _generate_route_custom_url(atom_book);
	// text += `export declare type RouteURL<A extends AtomName, R extends RouteName<A>> =\n`;
	// text += `\tR extends RouteCustomName<A> ? CustomRouteURL<A,R> :\n`;
	// text += `\tR extends RouteName<A> ? DefaultRouteURL<A,R> :\n`;
	// text += `\tnever\n`;
	text += `\n`;
	return text;
}

// function _generate_route_default_url(){
//   let text = '';
//   text += `declare type DefaultRouteURL<A extends AtomName, R extends RouteName<A>> =\n`;
//   for(const [key, val] of Object.entries(default_routes)){
//     text += `\tR extends '${key}' ? '${val.url}' :\n`;
//   }
//   text += `\tnever\n`;
//   text += `\n`;
//   return text;
// }

function _generate_route_name(atom_book:types.Book){
	let text = '';
	text += _generate_route_default_name();
	text += _generate_route_custom_name(atom_book);
	text += `export declare type RouteName<A extends AtomName> =\n`;
	text += `\tRouteCustomName<A> | RouteDefaultName;\n\n`;
	return text;
}

function _generate_route_default_name(){
	const default_route_keys = Object.keys(default_routes);
	let text = '';
	text += `declare type RouteDefaultName = `;
	text += default_route_keys.map((k) => `'${k}'`).join(' | ');
	text += `\n\n`;
	return text;
}

function _generate_route_custom_name(atom_book:types.Book){
	let text = '';
	text += `declare type RouteCustomName<A extends AtomName> =\n`;
	// text += `export declare type RouteName<A extends AtomName> =\n`;
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		const custom_routes = _route_custom_name<any>(atom_def);
		const routes = (custom_routes !== '') ? custom_routes : 'never';
		text += `\tA extends '${atom_name}' ? ${routes} :\n`;
	}
	text += `\tnever\n\n`;
	return text;
}

function _generate_route_custom_url(atom_book:types.Book){
	let text = '';
	// text += `declare type CustomRouteURL<A extends AtomName, R extends RouteCustomName<A>> =\n`;
	text += `export declare type RouteURL<A extends AtomName, R extends RouteName<A>> =\n`;
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		if(!atom_def.dock || !atom_def.dock.routes){
			text += `\tA extends '${atom_name}' ? never :\n`;
		}else{
			text += `\tA extends '${atom_name}' ?\n`;
			for(const [route_name, route_def] of Object.entries(atom_def.dock.routes)){
				text += `\t\tR extends '${route_name}' ? '${route_def.url}' :\n`;
			}
			text += `\t\tnever :\n`;
		}
	}
	text += `never\n\n`;
	return text;
}

function _generate_route_custom_query_param(atom_book:types.Book){
	let text = '';
	// text += `declare type CustomRouteQueryParam<A extends AtomName, R extends RouteCustomName<A>> =\n`;
	text += `export declare type RouteQueryParam<A extends AtomName, R extends RouteName<A>> =\n`;
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		if(!atom_def.dock || !atom_def.dock.routes){
			text += `\tA extends '${atom_name}' ? never :\n`;
		}else{
			text += `\tA extends '${atom_name}' ?\n`;
			for(const [route_name, route_def] of Object.entries(atom_def.dock.routes)){
				if(!route_def.query || !Array.isArray(route_def.query)){
					text += `\t\tR extends '${route_name}' ? never :\n`;
				}else{
					const joined_value = route_def.query.map((v:string) => `'${v}'`).join(' | ');
					text += `\t\tR extends '${route_name}' ? ${joined_value} :\n`;
				}
			}
			text += `\t\tnever :\n`;
		}
	}
	text += `never\n\n`;
	return text;
}

function _route_custom_name<A extends schema_types.AtomName>(atom_def:types.Book.Definition<A>){
	if(!atom_def.dock || !atom_def.dock.routes){
		return 'never';
	}
	const route_array:string[] = [];
	for(const [route_name, _route_def] of Object.entries(atom_def.dock.routes)){
		if(typeof (default_routes as any)[route_name] === 'undefined'){
			route_array.push(`'${route_name}'`);
		}
	}
	return route_array.join(' | ');
}

