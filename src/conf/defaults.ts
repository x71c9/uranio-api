/**
 * Module for default configuration object
 *
 * @packageDocumentation
 */

import {Configuration} from '../srv/types';

import core from 'uranio-core';

export const api_config:Required<Configuration> = {
	
	...core.conf.get_all(),
	
	default_atoms_request: false,
	
	default_atoms_error: false,
	
	request_auto_limit: 128,
	
	service: 'express',
	
	service_protocol: 'http',
	
	service_domain: '0.0.0.0',
	
	service_port: 7777,
	
	dev_service_protocol: 'http',
	
	dev_service_domain: '0.0.0.0',
	
	dev_service_port: 7777,
	
	lambda: 'netlify',
	
	prefix_api: '/uranio/api',
	
	prefix_log: '/logs',
	
};
