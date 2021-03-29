/**
 * Service index module
 *
 * @packageDocumentation
 */

import * as express from './express/';

import {Service, ServiceType} from './types';

export * from './types';

export function create(service_type:ServiceType)
		:Service{
	switch(service_type){
		case 'express':{
			return express.create();
		}
	}
}
