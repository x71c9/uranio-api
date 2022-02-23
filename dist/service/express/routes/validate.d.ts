/**
 * Validate Route request module
 *
 * @packageDocumentation
 */
import { ExpressQueryParam } from '../types';
import { schema } from '../../../sch/server';
export declare function process_request_query<A extends schema.AtomName>(query: ExpressQueryParam): schema.Query<A>;
export declare function only_valid_query_keys(query: unknown, valid_query_keys: string[]): void;
export declare function only_valid_param_keys(params: unknown, valid_params_keys: string[]): void;
export declare function empty(p: unknown, param_name: string): true;
