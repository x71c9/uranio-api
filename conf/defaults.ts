/**
 * Module for default configuration object
 *
 * @packageDocumentation
 */

import {FullConfiguration} from '../types';

import {core_config} from '../core/conf/defaults';

export const web_config:FullConfiguration = {
	
	...core_config,
	
	request_auto_limit: 2,
	
	service: 'express',
	
};
