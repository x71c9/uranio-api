/**
 * Register module
 *
 * @packageDocumentation
 */


import {urn_log} from 'urn-lib';

import path from 'path';

import caller from 'caller';

import * as book from '../book/client';

import * as types from '../cln/types';

import {schema} from '../sch/client';

export function route<A extends schema.AtomName, R extends schema.RouteName<A>>(
	route: types.Book.Definition.Dock.Routes.Route,
	atom_name?: A,
	route_name?: R
):string{
	const final_atom_name = _get_atom_name(atom_name);
	const final_route_name = _get_route_name(route_name);
	book.add_route_definition(final_atom_name, final_route_name, route);
	urn_log.debug(`Client route [${final_route_name}] for atom [${final_atom_name}] registered.`);
	return final_atom_name;
}

function _get_atom_name<A extends schema.AtomName>(atom_name?:A){
	let final_atom_name = `undefined_atom`;
	if(atom_name){
		final_atom_name = atom_name;
	}else{
		const caller_path = caller();
		const dirname = path.dirname(caller_path);
		final_atom_name =
			dirname.split('/').slice(-2)[0].replace('.','_').replace('-','_');
	}
	return final_atom_name as A;
}

function _get_route_name<A extends schema.AtomName, R extends schema.RouteName<A>>(
	route_name?:R
):R{
	let final_route_name = 'undefined_route';
	if(route_name){
		final_route_name = route_name;
	}else{
		const caller_path = caller();
		final_route_name = caller_path.split('/').slice(-1)[0].replace(/\.[^/.]+$/, "");
	}
	return final_route_name as R;
}
