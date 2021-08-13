/**
 * Conf type module
 *
 * @packageDocumentation
 */

import {FullConfiguration as CoreFullConfiguration} from 'uranio-core/types';

import {ServiceName} from '../service/';

import {LambdaName} from '../lambda/';

type RequiredConfigParams = {
	service: ServiceName,
	lambda: LambdaName,
	prefix_api: string,
	prefix_log: string
}

type OptionalConfigParam = {
	service_port: number
	request_auto_limit: number,
}

export type Configuration =
	CoreFullConfiguration &
	RequiredConfigParams &
	Partial<OptionalConfigParam>;

export type FullConfiguration =
	CoreFullConfiguration &
	RequiredConfigParams &
	OptionalConfigParam;

