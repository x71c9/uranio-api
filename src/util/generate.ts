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

// import {default_routes} from '../routes/client';

export let process_params = {
	urn_command: `schema`,
	// urn_base_schema: `./.uranio/generate/base/schema.d.ts`,
	// urn_output_dir: `.`
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
	// txt += _generate_default_response();
	txt += _generate_custom_response(atom_book);
	// txt += _generate_response();
	return txt;
}

// function _generate_default_response(){
//   let text = '';
//   text += `declare type DefaultResponse<A extends AtomName, R extends RouteName<A>, D extends Depth = 0> =\n`;
//   // for(const [route_name, route_def] of Object.entries(api.routes.default_routes)){
//   //   text += `\tR extends '${route_name}' ? \n`;
//   // }
//   text += `\tR extends 'count' ? urn_response.General<number, any> :\n`;
//   text += `\tR extends 'find_id' ? urn_response.General<Molecule<A,D>,any> :\n`;
//   text += `\tR extends 'find' ? urn_response.General<Molecule<A,D>[],any> :\n`;
//   text += `\tR extends 'find_one' ? urn_response.General<Molecule<A,D>,any> :\n`;
//   text += `\tR extends 'insert' ? urn_response.General<Molecule<A,D>,any> :\n`;
//   text += `\tR extends 'update' ? urn_response.General<Molecule<A,D>,any> :\n`;
//   text += `\tR extends 'delete' ? urn_response.General<Molecule<A,D>,any> :\n`;
//   text += `\tR extends 'insert_multiple' ? urn_response.General<Molecule<A,D>[],any> :\n`;
//   text += `\tR extends 'update_multiple' ? urn_response.General<Molecule<A,D>[],any> :\n`;
//   text += `\tR extends 'delete_multiple' ? urn_response.General<Molecule<A,D>[],any> :\n`;
//   text += `\t// R extends 'upload' ? urn_response.General<Molecule<A,D>,any> :\n`;
//   text += `\t// R extends 'presigned' ? urn_response.General<string,any> :\n`;
//   text += `\tnever;\n`;
//   text += `\n`;
//   return text;
// }

function _generate_custom_response(atom_book:types.Book){
	let text = '';
	// text += `declare type CustomResponse<A extends AtomName, R extends RouteName<A>, D extends Depth = 0> =\n`;
	text += `\nexport declare type Response<A extends AtomName, R extends RouteName<A>, D extends Depth = 0> =\n`;
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		text += `\tA extends '${atom_name}' ?\n`;
		if(!atom_def.dock || !atom_def.dock.routes){
			text += `\t\tnever :\n`;
		}else{
			const routes = atom_def.dock.routes as types.Book.Definition.Dock.Routes<'superuser'>;
			for(const [route_name, route_def] of Object.entries(routes)){
				text += `\t\tR extends '${route_name}' ? ${route_def.return} :\n`;
			}
			text += `\t\tnever :\n`;
		}
	}
	text += `\tnever\n`;
	text += `\n`;
	return text;
}

// function _generate_response(){
//   let text = '';
//   text += `export declare type Response<A extends AtomName, R extends RouteName<A>, D extends Depth = 0> =\n`;
//   text += `\tR extends RouteDefaultName ? DefaultResponse<A,R,D> :\n`;
//   text += `\tR extends RouteCustomName<A> ? CustomResponse<A,R,D> :\n`;
//   text += `\tnever\n`;
//   text += `\n`;
//   return text;
// }


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
	// text += _generate_route_default_name();
	text += _generate_route_custom_name(atom_book);
	// text += `export declare type RouteName<A extends AtomName> =\n`;
	// text += `\tRouteCustomName<A> | RouteDefaultName;\n\n`;
	return text;
}

// function _generate_route_default_name(){
//   const default_route_keys = Object.keys(default_routes);
//   let text = '';
//   text += `declare type RouteDefaultName = `;
//   text += default_route_keys.map((k) => `'${k}'`).join(' | ');
//   text += `\n\n`;
//   return text;
// }

function _generate_route_custom_name(atom_book:types.Book){
	let text = '';
	// text += `declare type RouteCustomName<A extends AtomName> =\n`;
	text += `export declare type RouteName<A extends AtomName> =\n`;
	for(const [atom_name, atom_def] of Object.entries(atom_book)){
		text += `\tA extends '${atom_name}' ? ${_route_custom_name<any>(atom_def)} :\n`;
	}
	text += `never\n\n`;
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
	const route_names = Object.keys(atom_def.dock.routes).map((k) => `'${k}'`);
	return route_names.join(' | ');
}

