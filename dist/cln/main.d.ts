/**
 * Main module for client
 *
 * @packageDocumentation
 */
import core from 'uranio-core/client';
import { schema } from '../sch/index';
import * as routes from '../routes/client';
import * as book from '../book/client';
import * as log from '../log/index';
import * as types from './types';
export * from '../reg/client';
export { core, schema, types, book, log, routes };
