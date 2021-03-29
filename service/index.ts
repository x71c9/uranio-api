/**
 * Service index module
 *
 * @packageDocumentation
 */

import {web_config} from '../conf/defaults';

import * as express from './express/';

import {Service} from './types';

export * from './types';

export function create()
		:Service{
	switch(web_config.service){
		case 'express':{
			return express.create();
		}
	}
}
