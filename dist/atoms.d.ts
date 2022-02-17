/**
 * Required API books
 *
 * @packageDocumentation
 */
export declare const atom_book: {
    readonly error: {
        readonly plural: "errors";
        readonly read_only: true;
        readonly connection: "log";
        readonly security: {
            readonly type: any;
            readonly _r: any;
        };
        readonly properties: {
            readonly status: {
                readonly type: any;
                readonly label: "Status";
            };
            readonly msg: {
                readonly type: any;
                readonly label: "Message";
            };
            readonly error_code: {
                readonly type: any;
                readonly label: "Error Code";
            };
            readonly error_msg: {
                readonly type: any;
                readonly label: "Error Message";
            };
            readonly request: {
                readonly type: any;
                readonly label: "Request";
                readonly atom: "request";
                readonly delete_cascade: true;
                readonly optional: true;
            };
            readonly stack: {
                readonly type: any;
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
            readonly type: any;
            readonly _r: any;
        };
        readonly properties: {
            readonly full_path: {
                readonly type: any;
                readonly label: "Full path";
            };
            readonly route_path: {
                readonly type: any;
                readonly label: "Route path";
                readonly optional: true;
            };
            readonly atom_path: {
                readonly type: any;
                readonly label: "Atom path";
                readonly optional: true;
            };
            readonly connection_path: {
                readonly type: any;
                readonly label: "Connection path";
                readonly optional: true;
            };
            readonly method: {
                readonly type: any;
                readonly label: "Method";
                readonly values: readonly ["GET", "POST", "DELETE"];
                readonly optional: true;
            };
            readonly atom_name: {
                readonly type: any;
                readonly label: "Atom name";
                readonly optional: true;
                readonly on_error: () => string;
            };
            readonly route_name: {
                readonly type: any;
                readonly label: "Route name";
                readonly optional: true;
            };
            readonly params: {
                readonly type: any;
                readonly label: "Params";
                readonly optional: true;
            };
            readonly query: {
                readonly type: any;
                readonly label: "Query";
                readonly optional: true;
            };
            readonly headers: {
                readonly type: any;
                readonly label: "Headers";
                readonly optional: true;
            };
            readonly body: {
                readonly type: any;
                readonly label: "Body";
                readonly optional: true;
            };
            readonly file: {
                readonly type: any;
                readonly label: "File";
                readonly optional: true;
            };
            readonly ip: {
                readonly type: any;
                readonly label: "IP";
                readonly optional: true;
            };
            readonly is_auth: {
                readonly type: any;
                readonly label: "Is auth";
                readonly optional: true;
            };
            readonly auth_action: {
                readonly type: any;
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
