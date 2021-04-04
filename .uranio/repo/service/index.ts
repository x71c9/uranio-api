/**
 * Service index module
 *
 * @packageDocumentation
 */

import {web_config} from '../conf/defaults';

import * as express from './express/';

import {Service, ServiceName} from './types';

export * from './types';

export function create(service_name?:ServiceName)
		:Service{
	const service = service_name || web_config.service;
	switch(service){
		case 'express':{
			return express.create();
		}
	}
}
