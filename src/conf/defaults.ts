/**
 * Module for default configuration object
 *
 * @packageDocumentation
 */

import {Configuration} from '../srv/types';

import core from 'uranio-core';

export const api_config:Required<Configuration> = {
	
	...core.conf.defaults,
	
	request_auto_limit: 128,
	
	service: 'express',
	
	service_protocol: 'http',
	
	service_domain: 'localhost',
	
	service_port: 3000,
	
	lambda: 'netlify',
	
	prefix_api: '/uranio/api',
	
	prefix_log: '/logs',
	
};
