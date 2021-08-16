/**
 * Main module for server
 *
 * @packageDocumentation
 */


import urn_lib from 'urn-lib';

import core from 'uranio-core';

import * as service from '../service/';

import * as lambda from '../lambda/';

import * as routes from '../routes/';

import * as types from './types';

export {
	urn_lib as lib,
	core,
	service,
	lambda,
	routes,
	types
};
