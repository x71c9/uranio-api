/**
 * Conf type module
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

import {ServiceName} from '../service/server';

import {LambdaName} from '../lambda/server';

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
