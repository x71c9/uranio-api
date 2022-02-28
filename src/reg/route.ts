/**
 * Register module
 *
 * @packageDocumentation
 */


import {urn_log} from 'urn-lib';

import path from 'path';

import caller from 'caller';

import * as book from '../book/server';

import * as types from '../server/types';

import {schema} from '../sch/server';

export function route<A extends schema.AtomName, R extends schema.RouteName<A>>(
	route_call:types.Book.Definition.Dock.Routes.Route.Call<A,R>,
	atom_name?:A,
	route_name?:R
):string{
	let final_atom_name = `undefined_atom`;
	if(atom_name){
		final_atom_name = atom_name;
	}else{
		const caller_path = caller();
		const dirname = path.dirname(caller_path);
		final_atom_name =
			dirname.split('/').slice(-2)[0].replace('.','_').replace('-','_');
	}
	let final_route_name = 'undefined_route';
	if(route_name){
		final_route_name = route_name;
	}else{
		const caller_path = caller();
		final_route_name = caller_path.split('/').slice(-1)[0].replace(/\.[^/.]+$/, "");
	}
	// urn_log.debug(`Registering atom [${final_atom_name}]...`);
	book.add_route_call(final_atom_name as A, final_route_name as R, route_call);
	urn_log.debug(`Route call [${final_route_name}] for atom [${final_atom_name}] registered.`);
	return final_atom_name;
}

