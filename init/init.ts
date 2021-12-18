/**
 * Init module
 *
 * @packageDocumentation
 */

import urn_core from 'uranio-core';

import * as types from '../types';

export function init(config?:types.Configuration)
		:void{
	return urn_core.init(config);
}
