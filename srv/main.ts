/**
 * Main module for server
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

import * as service from '../service/';

import * as lambda from '../lambda/';

import * as routes from '../routes/';

import * as book from '../book/';

import * as types from './types';

/*
 * First level methods.
 * If other methods are added, urn-cli must be updated.
 * Go to urn-cli/src/cmd/transpose.ts and
 * add the new method names.
 */
export * from '../init/';

export {
	core,
	service,
	lambda,
	routes,
	book,
	types
};
