/**
 * Main module for client
 *
 * @packageDocumentation
 */

import core from 'uranio-core/client';

// export * from '../core/client';

import {schema} from '../sch/index';

import * as routes from '../routes/client';

import * as book from '../book/client';

import * as log from '../log/client';

import * as types from './types';

import * as conf from '../conf/client';

export * from '../reg/client';

export * from '../init/client';

export {
	core,
	schema,
	types,
	book,
	log,
	conf,
	routes
};
