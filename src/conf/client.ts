/**
 * Conf module
 *
 * @packageDocumentation
 */

import {urn_context} from 'uranio-utils';

import {api_client_config} from '../cln/default_conf';

import {ClientConfiguration} from '../cln/types';

import * as env from '../env/client';

const urn_ctx = urn_context.create<Required<ClientConfiguration>>(
	api_client_config,
	env.is_production(),
	'API:CONF:CLIENT'
);

export function get<k extends keyof ClientConfiguration>(
	param_name:k
):Required<ClientConfiguration>[k]{
	return urn_ctx.get(param_name);
}

export function set(config:Partial<ClientConfiguration>):void{
	urn_ctx.set(config);
}

export function get_all():Required<ClientConfiguration>{
	return urn_ctx.get_all();
}
