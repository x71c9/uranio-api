/**
 * Required API books
 *
 * @packageDocumentation
 */
import core from 'uranio-core';
export declare const atom_book: {
    readonly error: {
        readonly plural: "errors";
        readonly read_only: true;
        readonly connection: "log";
        readonly security: {
            readonly type: core.types.BookSecurity.UNIFORM;
            readonly _r: core.types.BookPermission.NOBODY;
        };
        readonly properties: {
            readonly status: {
                readonly type: core.types.BookProperty.INTEGER;
                readonly label: "Status";
            };
            readonly msg: {
                readonly type: core.types.BookProperty.TEXT;
                readonly label: "Message";
            };
            readonly error_code: {
                readonly type: core.types.BookProperty.TEXT;
                readonly label: "Error Code";
            };
            readonly error_msg: {
                readonly type: core.types.BookProperty.TEXT;
                readonly label: "Error Message";
            };
            readonly request: {
                readonly type: core.types.BookProperty.ATOM;
                readonly label: "Request";
                readonly atom: "request";
                readonly delete_cascade: true;
                readonly optional: true;
            };
            readonly stack: {
                readonly type: core.types.BookProperty.LONG_TEXT;
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
            readonly type: core.types.BookSecurity.UNIFORM;
            readonly _r: core.types.BookPermission.NOBODY;
        };
        readonly properties: {
            readonly full_path: {
                readonly type: core.types.BookProperty.TEXT;
                readonly label: "Full path";
            };
            readonly route_path: {
                readonly type: core.types.BookProperty.TEXT;
                readonly label: "Route path";
                readonly optional: true;
            };
            readonly atom_path: {
                readonly type: core.types.BookProperty.TEXT;
                readonly label: "Atom path";
                readonly optional: true;
            };
            readonly connection_path: {
                readonly type: core.types.BookProperty.TEXT;
                readonly label: "Connection path";
                readonly optional: true;
            };
            readonly method: {
                readonly type: core.types.BookProperty.ENUM_STRING;
                readonly label: "Method";
                readonly values: readonly ["GET", "POST", "DELETE"];
                readonly optional: true;
            };
            readonly atom_name: {
                readonly type: core.types.BookProperty.TEXT;
                readonly label: "Atom name";
                readonly optional: true;
                readonly on_error: () => string;
            };
            readonly route_name: {
                readonly type: core.types.BookProperty.TEXT;
                readonly label: "Route name";
                readonly optional: true;
            };
            readonly params: {
                readonly type: core.types.BookProperty.TEXT;
                readonly label: "Params";
                readonly optional: true;
            };
            readonly query: {
                readonly type: core.types.BookProperty.TEXT;
                readonly label: "Query";
                readonly optional: true;
            };
            readonly headers: {
                readonly type: core.types.BookProperty.LONG_TEXT;
                readonly label: "Headers";
                readonly optional: true;
            };
            readonly body: {
                readonly type: core.types.BookProperty.LONG_TEXT;
                readonly label: "Body";
                readonly optional: true;
            };
            readonly file: {
                readonly type: core.types.BookProperty.TEXT;
                readonly label: "File";
                readonly optional: true;
            };
            readonly ip: {
                readonly type: core.types.BookProperty.TEXT;
                readonly label: "IP";
                readonly optional: true;
            };
            readonly is_auth: {
                readonly type: core.types.BookProperty.BINARY;
                readonly label: "Is auth";
                readonly optional: true;
            };
            readonly auth_action: {
                readonly type: core.types.BookProperty.ENUM_STRING;
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
