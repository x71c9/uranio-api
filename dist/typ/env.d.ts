/**
 * Env type module
 *
 * @packageDocumentation
 */
import core from 'uranio-core';
declare type RequiredEnvParams = {};
declare type OptionalEnvParam = {
    ssl_certificate: string;
    ssl_key: string;
};
export declare type Environment = core.types.Environment & RequiredEnvParams & Partial<OptionalEnvParam>;
export {};
