/**
 * Module for default configuration object
 *
 * @packageDocumentation
 */

import {FullConfiguration} from '../types';

import {core_config} from '../core/conf/defaults';

export const web_config:FullConfiguration = {
	
	...core_config,
	
	web_optional_param: '',
	
	web_required_param: ''
	
};
