/**
 * Web Main module
 *
 * @packageDocumentation
 */

import urn_lib from 'urn-lib';

import core from 'uranio-core';

import * as types from './types';

import * as service from './service/';

import * as lambda from './lambda/';

export {
	urn_lib as lib,
	core,
	lambda,
	types,
	service
};
