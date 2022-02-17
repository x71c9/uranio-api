"use strict";
/**
 * Required API books
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atom_book = void 0;
const uranio_core_1 = __importDefault(require("uranio-core"));
exports.atom_book = {
    error: {
        plural: 'errors',
        read_only: true,
        connection: 'log',
        security: {
            type: uranio_core_1.default.types.BookSecurity.UNIFORM,
            _r: uranio_core_1.default.types.BookPermission.NOBODY
        },
        properties: {
            status: {
                type: uranio_core_1.default.types.BookProperty.INTEGER,
                label: 'Status'
            },
            msg: {
                type: uranio_core_1.default.types.BookProperty.TEXT,
                label: 'Message'
            },
            error_code: {
                type: uranio_core_1.default.types.BookProperty.TEXT,
                label: 'Error Code'
            },
            error_msg: {
                type: uranio_core_1.default.types.BookProperty.TEXT,
                label: 'Error Message'
            },
            request: {
                type: uranio_core_1.default.types.BookProperty.ATOM,
                label: 'Request',
                atom: 'request',
                delete_cascade: true,
                optional: true
            },
            stack: {
                type: uranio_core_1.default.types.BookProperty.LONG_TEXT,
                label: 'Stack',
                optional: true
            }
        },
        dock: {
            url: '/errors',
            // routes: {
            //   errroute: {
            //     method: types.RouteMethod.GET,
            //     action: core.types.AuthAction.READ,
            //     url: '/errrr',
            //     query: ['title','length'],
            //     params: {},
            //     return: 'string'
            //   }
            // }
        }
    },
    request: {
        plural: 'requests',
        read_only: true,
        connection: 'log',
        security: {
            type: uranio_core_1.default.types.BookSecurity.UNIFORM,
            _r: uranio_core_1.default.types.BookPermission.NOBODY
        },
        properties: {
            full_path: {
                type: uranio_core_1.default.types.BookProperty.TEXT,
                label: "Full path",
            },
            route_path: {
                type: uranio_core_1.default.types.BookProperty.TEXT,
                label: "Route path",
                optional: true
            },
            atom_path: {
                type: uranio_core_1.default.types.BookProperty.TEXT,
                label: "Atom path",
                optional: true
            },
            connection_path: {
                type: uranio_core_1.default.types.BookProperty.TEXT,
                label: "Connection path",
                optional: true
            },
            method: {
                type: uranio_core_1.default.types.BookProperty.ENUM_STRING,
                label: "Method",
                values: ['GET', 'POST', 'DELETE'],
                optional: true,
            },
            atom_name: {
                type: uranio_core_1.default.types.BookProperty.TEXT,
                label: "Atom name",
                optional: true,
                on_error: () => {
                    return "generic_atom";
                },
            },
            route_name: {
                type: uranio_core_1.default.types.BookProperty.TEXT,
                label: "Route name",
                optional: true,
            },
            params: {
                type: uranio_core_1.default.types.BookProperty.TEXT,
                label: "Params",
                optional: true,
            },
            query: {
                type: uranio_core_1.default.types.BookProperty.TEXT,
                label: "Query",
                optional: true,
            },
            headers: {
                type: uranio_core_1.default.types.BookProperty.LONG_TEXT,
                label: "Headers",
                optional: true,
            },
            body: {
                type: uranio_core_1.default.types.BookProperty.LONG_TEXT,
                label: "Body",
                optional: true,
            },
            file: {
                type: uranio_core_1.default.types.BookProperty.TEXT,
                label: "File",
                optional: true,
            },
            ip: {
                type: uranio_core_1.default.types.BookProperty.TEXT,
                label: "IP",
                optional: true
            },
            is_auth: {
                type: uranio_core_1.default.types.BookProperty.BINARY,
                label: "Is auth",
                optional: true
            },
            auth_action: {
                type: uranio_core_1.default.types.BookProperty.ENUM_STRING,
                label: "Auth action",
                values: ["READ", "WRITE", "AUTH"],
                on_error: () => {
                    return "READ";
                },
                optional: true,
            },
        },
        dock: {
            url: '/requests'
        }
    },
};
//# sourceMappingURL=atoms.js.map