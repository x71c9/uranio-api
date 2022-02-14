/**
 * Conf type module
 *
 * @packageDocumentation
 */

// import {FullConfiguration as CoreFullConfiguration} from 'uranio-core/types';

import core from 'uranio-core';

import {ServiceName} from '../service/index';

import {LambdaName} from '../lambda/index';

type RequiredConfigParams = {
}

type OptionalConfigParam = {
	service: ServiceName
	lambda: LambdaName
	prefix_api: string
	prefix_log: string
	service_protocol: string
	service_domain: string
	service_port: number
	request_auto_limit: number
}

export type Configuration =
	core.types.Configuration &
	RequiredConfigParams &
	Partial<OptionalConfigParam>;

// export type FullConfiguration =
//   core.types.FullConfiguration &
//   RequiredConfigParams &
//   OptionalConfigParam;
