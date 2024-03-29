"use strict";
/**
 * Required API books
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.required_atoms = void 0;
const types = __importStar(require("../cln/types"));
exports.required_atoms = {
    _error: {
        plural: '_errors',
        read_only: true,
        connection: 'log',
        security: {
            type: types.SecurityType.UNIFORM,
            _r: types.PermissionType.NOBODY
        },
        properties: {
            status: {
                type: types.PropertyType.INTEGER,
                primary: true,
                label: 'Status'
            },
            msg: {
                type: types.PropertyType.TEXT,
                search: true,
                primary: true,
                label: 'Message'
            },
            error_code: {
                type: types.PropertyType.TEXT,
                search: true,
                primary: true,
                label: 'Error Code'
            },
            error_msg: {
                type: types.PropertyType.TEXT,
                search: true,
                primary: true,
                label: 'Error Message'
            },
            request: {
                type: types.PropertyType.ATOM,
                label: 'Request',
                atom: '_request',
                delete_cascade: true,
                optional: true
            },
            stack: {
                type: types.PropertyType.LONG_TEXT,
                search: true,
                label: 'Stack',
                optional: true
            }
        },
        dock: {
            url: '/_errors',
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
    _request: {
        plural: '_requests',
        read_only: true,
        connection: 'log',
        security: {
            type: types.SecurityType.UNIFORM,
            _r: types.PermissionType.NOBODY
        },
        properties: {
            full_path: {
                type: types.PropertyType.TEXT,
                search: true,
                primary: true,
                label: "Full path",
            },
            route_path: {
                type: types.PropertyType.TEXT,
                search: true,
                label: "Route path",
                optional: true
            },
            atom_path: {
                type: types.PropertyType.TEXT,
                search: true,
                label: "Atom path",
                optional: true
            },
            connection_path: {
                type: types.PropertyType.TEXT,
                search: true,
                label: "Connection path",
                optional: true
            },
            method: {
                type: types.PropertyType.ENUM_STRING,
                label: "Method",
                values: ['GET', 'POST', 'DELETE'],
                optional: true,
            },
            atom_name: {
                type: types.PropertyType.TEXT,
                search: true,
                label: "Atom name",
                optional: true,
                on_error: () => {
                    return "generic_atom";
                },
            },
            route_name: {
                type: types.PropertyType.TEXT,
                search: true,
                label: "Route name",
                optional: true,
            },
            params: {
                type: types.PropertyType.TEXT,
                search: true,
                label: "Params",
                optional: true,
            },
            query: {
                type: types.PropertyType.TEXT,
                search: true,
                label: "Query",
                optional: true,
            },
            headers: {
                type: types.PropertyType.LONG_TEXT,
                search: true,
                label: "Headers",
                optional: true,
            },
            body: {
                type: types.PropertyType.LONG_TEXT,
                search: true,
                label: "Body",
                optional: true,
            },
            file: {
                type: types.PropertyType.TEXT,
                label: "File",
                optional: true,
            },
            ip: {
                type: types.PropertyType.TEXT,
                search: true,
                label: "IP",
                optional: true
            },
            is_auth: {
                type: types.PropertyType.BINARY,
                label: "Is auth",
                optional: true
            },
            auth_action: {
                type: types.PropertyType.ENUM_STRING,
                label: "Auth action",
                values: ["READ", "WRITE", "AUTH"],
                on_error: () => {
                    return "READ";
                },
                optional: true,
            },
        },
        dock: {
            url: '/_requests'
        }
    },
};
//# sourceMappingURL=atoms.js.map