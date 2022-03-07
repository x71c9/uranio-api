/**
 * Client Env type module
 *
 * @packageDocumentation
 */
import core_client from 'uranio-core/client';
declare type RequiredClientEnvParams = {};
declare type OptionalClientEnvParam = {};
export declare type ClientEnvironment = core_client.types.ClientEnvironment & RequiredClientEnvParams & Partial<OptionalClientEnvParam>;
export {};
