/**
 * Module for default client configuration object
 *
 * @packageDocumentation
 */
import { ClientEnvironment } from './types';
/**
 * IMPORTANT: if new variable are added here they must be added on
 * uranio-trx/conf/client.ts
 *
 * Unfortunately the browser doesn't allow to dynamically access process.env
 * variable, like process.env[var_name] where `var_name` is a variable.
 */
export declare const api_client_env: Required<ClientEnvironment>;
