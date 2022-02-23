/**
 * Client Conf type module
 *
 * @packageDocumentation
 */
import core_client from 'uranio-core/client';
declare type RequiredClientConfigParams = {};
declare type OptionalClientConfigParam = {};
export declare type ClientConfiguration = core_client.types.ClientConfiguration & RequiredClientConfigParams & Partial<OptionalClientConfigParam>;
export {};
