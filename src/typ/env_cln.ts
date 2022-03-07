/**
 * Client Env type module
 *
 * @packageDocumentation
 */

import core_client from 'uranio-core/client';

type RequiredClientEnvParams = {
}

type OptionalClientEnvParam = {
}

export type ClientEnvironment =
	core_client.types.ClientEnvironment &
	RequiredClientEnvParams &
	Partial<OptionalClientEnvParam>;
