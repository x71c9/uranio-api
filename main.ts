/**
 * Api Main module
 *
 * @packageDocumentation
 */

import urn_lib from 'urn-lib';

import core from 'uranio-core';

import * as service from './service/';

import * as lambda from './lambda/';

import * as types from './types';

export {
	urn_lib as lib,
	core,
	lambda,
	types,
	service
};
