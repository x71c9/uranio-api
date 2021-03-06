/**
 * Generate module
 *
 * @packageDocumentation
 */
import { ClientConfiguration } from '../typ/conf_cln';
export declare let process_params: {
    urn_command: string;
};
export declare function schema(): string;
export declare function schema_and_save(): void;
export declare function save_schema(text: string): void;
export declare function init(): void;
export declare function client_config(client_default: Required<ClientConfiguration>): string;
export declare function client_config_and_save(client_default: Required<ClientConfiguration>): void;
export declare function save_client_config(text: string): void;
