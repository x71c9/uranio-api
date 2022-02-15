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

import * as types from './types';

/*
 * First level methods.
 * If other methods are added, urn-cli must be updated.
 * Go to urn-cli/src/cmd/transpose.ts and
 * add the new method names.
 */
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
	types
};
