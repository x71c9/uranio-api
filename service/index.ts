/**
 * Service index module
 *
 * @packageDocumentation
 */

import {api_config} from '../conf/defaults';

import * as express from './express/';

import {Service, ServiceName} from './types';

export * from './types';

export function create(service_name?:ServiceName)
		:Service{
	const service = service_name || api_config.service;
	switch(service){
		case 'express':{
			return express.create();
		}
	}
}
