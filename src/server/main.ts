/**
 * Main module for server
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

import {schema} from '../sch/server';

import * as service from '../service/server';

import * as lambda from '../lambda/server';

import * as routes from '../routes/server';

import * as book from '../book/server';

import * as conf from '../conf/server';

import * as util from '../util/server';

import * as log from '../log/server';

import * as types from './types';

export * from '../init/server';

export * from '../reg/server';

export {
	core,
	schema,
	service,
	lambda,
	routes,
	book,
	conf,
	util,
	log,
	types
};
