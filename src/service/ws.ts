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

export * from '../srv/register';

import uranio from '../server';
uranio.init();

const service = uranio.service.create();
service.listen();

export * from '../srv/delta/index';

