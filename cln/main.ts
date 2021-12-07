/**
 * Main module for client
 *
 * @packageDocumentation
 */

import core from "../core/client";

import * as types from './types';

import * as routes from '../routes/client';

import * as book from '../book/client';

export {
	core,
	types,
	book,
	routes
};
