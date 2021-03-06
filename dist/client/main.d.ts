/**
 * Main module for client
 *
 * @packageDocumentation
 */
import core from 'uranio-core/client';
import { schema } from '../sch/client';
import * as routes from '../routes/client';
import * as book from '../book/client';
import * as log from '../log/client';
import * as types from './types';
import * as conf from '../conf/client';
import * as env from '../env/client';
import * as register from '../reg/client';
import * as required from '../req/client';
export * from '../init/client';
export { core, schema, types, book, log, conf, env, register, required, routes };
