/**
 * Web Main module
 *
 * @packageDocumentation
 */

import urn_lib from 'urn-lib';

import core from 'urn_core';

import * as types from './types';

import * as service from './service/';

export {
	urn_lib as lib,
	core,
	types,
	service
};
