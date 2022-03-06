#!/usr/bin/env node

/**
 * Api Web Service Binary
 *
 * @packageDocumentation
 */

import dotenv from 'dotenv';
const result = dotenv.config();

if(result.error){
	throw result.error;
}

import {urn_log} from 'urn-lib';
urn_log.init({
	log_level: urn_log.LogLevel.FUNCTION_DEBUG,
	debug_info: false,
	color: true
});

export * from '../server/register';

import uranio from '../server';
uranio.init();

const service = uranio.service.create();
service.listen(() => {
	urn_log.debug(`Uranio service listening on port ${uranio.conf.get(`service_port`)}...`);
});
