/**
 * Required API books
 *
 * @packageDocumentation
 */
import * as types from '../client/types';
export declare const required_atoms: {
    readonly error: {
        readonly plural: "errors";
        readonly read_only: true;
        readonly connection: "log";
        readonly security: {
            readonly type: types.SecurityType.UNIFORM;
            readonly _r: types.PermissionType.NOBODY;
        };
        readonly properties: {
            readonly status: {
                readonly type: types.PropertyType.INTEGER;
                readonly label: "Status";
            };
            readonly msg: {
                readonly type: types.PropertyType.TEXT;
                readonly search: true;
                readonly label: "Message";
            };
            readonly error_code: {
                readonly type: types.PropertyType.TEXT;
                readonly search: true;
                readonly label: "Error Code";
            };
            readonly error_msg: {
                readonly type: types.PropertyType.TEXT;
                readonly search: true;
                readonly label: "Error Message";
            };
            readonly request: {
                readonly type: types.PropertyType.ATOM;
                readonly label: "Request";
                readonly atom: "request";
                readonly delete_cascade: true;
                readonly optional: true;
            };
            readonly stack: {
                readonly type: types.PropertyType.LONG_TEXT;
                readonly search: true;
                readonly label: "Stack";
                readonly optional: true;
            };
        };
        readonly dock: {
            readonly url: "/errors";
        };
    };
    readonly request: {
        readonly plural: "requests";
        readonly read_only: true;
        readonly connection: "log";
        readonly security: {
            readonly type: types.SecurityType.UNIFORM;
            readonly _r: types.PermissionType.NOBODY;
        };
        readonly properties: {
            readonly full_path: {
                readonly type: types.PropertyType.TEXT;
                readonly search: true;
                readonly label: "Full path";
            };
            readonly route_path: {
                readonly type: types.PropertyType.TEXT;
                readonly search: true;
                readonly label: "Route path";
                readonly optional: true;
            };
            readonly atom_path: {
                readonly type: types.PropertyType.TEXT;
                readonly search: true;
                readonly label: "Atom path";
                readonly optional: true;
            };
            readonly connection_path: {
                readonly type: types.PropertyType.TEXT;
                readonly search: true;
                readonly label: "Connection path";
                readonly optional: true;
            };
            readonly method: {
                readonly type: types.PropertyType.ENUM_STRING;
                readonly label: "Method";
                readonly values: readonly ["GET", "POST", "DELETE"];
                readonly optional: true;
            };
            readonly atom_name: {
                readonly type: types.PropertyType.TEXT;
                readonly search: true;
                readonly label: "Atom name";
                readonly optional: true;
                readonly on_error: () => string;
            };
            readonly route_name: {
                readonly type: types.PropertyType.TEXT;
                readonly search: true;
                readonly label: "Route name";
                readonly optional: true;
            };
            readonly params: {
                readonly type: types.PropertyType.TEXT;
                readonly search: true;
                readonly label: "Params";
                readonly optional: true;
            };
            readonly query: {
                readonly type: types.PropertyType.TEXT;
                readonly search: true;
                readonly label: "Query";
                readonly optional: true;
            };
            readonly headers: {
                readonly type: types.PropertyType.LONG_TEXT;
                readonly search: true;
                readonly label: "Headers";
                readonly optional: true;
            };
            readonly body: {
                readonly type: types.PropertyType.LONG_TEXT;
                readonly search: true;
                readonly label: "Body";
                readonly optional: true;
            };
            readonly file: {
                readonly type: types.PropertyType.TEXT;
                readonly label: "File";
                readonly optional: true;
            };
            readonly ip: {
                readonly type: types.PropertyType.TEXT;
                readonly search: true;
                readonly label: "IP";
                readonly optional: true;
            };
            readonly is_auth: {
                readonly type: types.PropertyType.BINARY;
                readonly label: "Is auth";
                readonly optional: true;
            };
            readonly auth_action: {
                readonly type: types.PropertyType.ENUM_STRING;
                readonly label: "Auth action";
                readonly values: readonly ["READ", "WRITE", "AUTH"];
                readonly on_error: () => string;
                readonly optional: true;
            };
        };
        readonly dock: {
            readonly url: "/requests";
        };
    };
};
