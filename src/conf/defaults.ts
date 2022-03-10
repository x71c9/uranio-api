/**
 * Module for default configuration object
 *
 * @packageDocumentation
 */

import {Configuration} from '../server/types';

import core from 'uranio-core';

export const api_config:Required<Configuration> = {
	
	...core.conf.get_all(),
	
	request_auto_limit: 128,
	
	service: 'express',
	
	service_protocol: 'http',
	
	service_domain: 'localhost',
	
	service_port: 3000,
	
	dev_service_protocol: 'http',
	
	dev_service_domain: 'localhost',
	
	dev_service_port: 7777,
	
	lambda: 'netlify',
	
	prefix_api: '/uranio/api',
	
	prefix_log: '/logs',
	
};
