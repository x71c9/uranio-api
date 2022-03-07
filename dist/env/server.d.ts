/**
 * Env module
 *
 * @packageDocumentation
 */
import { api_env } from './defaults';
export { api_env as defaults };
import * as types from '../server/types';
export declare function get<k extends keyof types.Environment>(param_name: k): typeof api_env[k];
export declare function is_initialized(): boolean;
export declare function set_initialize(is_initialized: boolean): void;
export declare function set_from_env(repo_env: Required<types.Environment>): void;
export declare function set(repo_env: Required<types.Environment>, config: Partial<types.Environment>): void;
