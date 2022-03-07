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
	service_dev_protocol: string
	service_dev_domain: string
	service_dev_port: number
	lambda: LambdaName
	prefix_api: string
	prefix_log: string
}

export type Configuration =
	core.types.Configuration &
	RequiredConfigParams &
	Partial<OptionalConfigParam>;
