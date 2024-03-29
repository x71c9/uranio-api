/**
 * Service index module
 *
 * @packageDocumentation
 */

import {urn_log} from 'uranio-utils';

import * as conf from '../conf/server';

import * as express from './express/index';

import {Service, ServiceName} from './types';

export * from './types';

export function create(service_name?:ServiceName)
		:Service{
	urn_log.trace(`Create Service`);
	const service = service_name || conf.get(`service`);
	switch(service){
		case 'express':{
			return express.create();
		}
	}
}
