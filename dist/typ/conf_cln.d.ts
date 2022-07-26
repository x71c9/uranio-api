/**
 * Client Conf type module
 *
 * @packageDocumentation
 */
import core_client from 'uranio-core/client';
declare type RequiredClientConfigParams = {};
declare type OptionalClientConfigParam = {
    default_atoms_request: boolean;
    default_atoms_error: boolean;
    prefix_log: string;
};
export declare type ClientConfiguration = core_client.types.ClientConfiguration & RequiredClientConfigParams & Partial<OptionalClientConfigParam>;
export {};
