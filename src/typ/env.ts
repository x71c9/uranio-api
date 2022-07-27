/**
 * Env type module
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

type RequiredEnvParams = {
}

type OptionalEnvParam = {
	https: boolean
	ssl_certificate: string
	ssl_key: string
}

export type Environment =
	core.types.Environment &
	RequiredEnvParams &
	Partial<OptionalEnvParam>;
