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
	request_auto_limit: number
	service: ServiceName
	service_protocol: string
	service_domain: string
	service_port: number
	dev_service_protocol: string
	dev_service_domain: string
	dev_service_port: number
	lambda: LambdaName
	prefix_api: string
	prefix_log: string
}

export type Configuration =
	core.types.Configuration &
	RequiredConfigParams &
	Partial<OptionalConfigParam>;
