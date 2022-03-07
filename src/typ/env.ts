/**
 * Env type module
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

type RequiredEnvParams = {
}

type OptionalEnvParam = {
}

export type Environment =
	core.types.Environment &
	RequiredEnvParams &
	Partial<OptionalEnvParam>;
