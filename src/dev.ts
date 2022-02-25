/**
 * Api run module
 *
 * @packageDocumentation
 */

export * from './server/register';

import {urn_log} from 'urn-lib';
urn_log.init({
	log_level: urn_log.LogLevel.FUNCTION_DEBUG,
	debug_info: false,
	color: true
});

import uranio from './server';
uranio.init();
