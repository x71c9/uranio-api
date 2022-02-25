/**
 * Client Conf type module
 *
 * @packageDocumentation
 */

import core_client from 'uranio-core/client';

type RequiredClientConfigParams = {
}

type OptionalClientConfigParam = {
	prefix_log: string
}

export type ClientConfiguration =
	core_client.types.ClientConfiguration &
	RequiredClientConfigParams &
	Partial<OptionalClientConfigParam>;
