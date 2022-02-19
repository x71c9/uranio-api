/**
 * Main module for server
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

export * from '../sch/index';

import * as service from '../service/index';

import * as lambda from '../lambda/index';

import * as routes from '../routes/index';

import * as book from '../book/index';

import * as conf from '../conf/index';

import * as util from '../util/index';

import * as log from '../log/index';

import * as types from './types';

export * from '../init/index';

export * from '../reg/index';

export {
	core,
	service,
	lambda,
	routes,
	book,
	conf,
	util,
	log,
	types
};
