/**
 * Service index module
 *
 * @packageDocumentation
 */

// import {api_config} from '../cnf/defaults';
import * as conf from '../conf/';

import * as express from './express/';

import {Service, ServiceName} from './types';

export * from './types';

export function create(service_name?:ServiceName)
		:Service{
	const service = service_name || conf.get(`service`);
	switch(service){
		case 'express':{
			return express.create();
		}
	}
}
