/**
 * Env module
 *
 * @packageDocumentation
 */

import {urn_context} from 'urn-lib';

import core from 'uranio-core';

import {api_env} from './defaults';

import {Environment} from '../typ/env';

const urn_ctx = urn_context.create<Required<Environment>>(
	api_env,
	is_production(),
	'API:ENV'
);

export function is_production():boolean{
	return core.env.is_production();
}

export function get<k extends keyof Environment>(
	param_name:k
):Required<Environment>[k]{
	return urn_ctx.get(param_name);
}

export function get_all():Required<Environment>{
	return urn_ctx.get_all();
}

export function set(env:Partial<Environment>):void{
	urn_ctx.set(env);
}

export function set_env():void{
	urn_ctx.set_env();
}

