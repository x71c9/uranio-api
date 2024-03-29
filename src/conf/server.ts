/**
 * Conf module
 *
 * @packageDocumentation
 */

import {urn_context} from 'uranio-utils';

import {api_config} from './defaults';

import {Configuration} from '../typ/conf';

import * as env from '../env/server';

const urn_ctx = urn_context.create<Required<Configuration>>(
	api_config,
	env.is_production(),
	'API:CONF'
);

export function get<k extends keyof Configuration>(
	param_name:k
):Required<Configuration>[k]{
	return urn_ctx.get(param_name);
}

export function set(config:Partial<Configuration>):void{
	urn_ctx.set(config);
}

export function get_all():Required<Configuration>{
	return urn_ctx.get_all();
}
