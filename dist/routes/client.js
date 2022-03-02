"use strict";
/**
 * Client routes module
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_media_routes = exports.media_routes = exports.default_routes = void 0;
const client_1 = __importDefault(require("uranio-core/client"));
const types = __importStar(require("../client/types"));
// import {schema} from '../sch/index';
// import {
//   route_def as common_route_def,
//   atom_dock_with_defaults as common_atom_dock_with_defaults
// } from './common';
/**
 *
 * NOTE:
 *
 * If the default routes change, they must change also in:
 * - routes/server.ts
 * - uranio/urn-cli/cmd/hook.ts
 *
 */
exports.default_routes = {
    count: {
        method: types.RouteMethod.GET,
        action: client_1.default.types.AuthAction.READ,
        url: '/count',
        return: 'number',
        query: ['filter'],
    },
    find_one: {
        method: types.RouteMethod.GET,
        action: client_1.default.types.AuthAction.READ,
        url: '/first',
        return: 'Molecule<A,D>',
        query: ['filter', 'options'],
    },
    find: {
        method: types.RouteMethod.GET,
        action: client_1.default.types.AuthAction.READ,
        url: '/',
        return: 'Molecule<A,D>[]',
        query: ['filter', 'options'],
    },
    find_id: {
        method: types.RouteMethod.GET,
        action: client_1.default.types.AuthAction.READ,
        url: '/:id',
        return: 'Molecule<A,D>',
        query: ['options'],
    },
    insert: {
        method: types.RouteMethod.POST,
        action: client_1.default.types.AuthAction.WRITE,
        url: '/',
        return: 'Molecule<A,D>',
    },
    update: {
        method: types.RouteMethod.POST,
        action: client_1.default.types.AuthAction.WRITE,
        url: '/:id',
        return: 'Molecule<A,D>',
    },
    delete: {
        method: types.RouteMethod.DELETE,
        action: client_1.default.types.AuthAction.WRITE,
        url: '/:id',
        return: 'Molecule<A,D>',
    },
    insert_multiple: {
        method: types.RouteMethod.POST,
        action: client_1.default.types.AuthAction.WRITE,
        url: '/multiple',
        return: 'Molecule<A,D>[]',
    },
    update_multiple: {
        method: types.RouteMethod.POST,
        action: client_1.default.types.AuthAction.WRITE,
        params: {
            ids: {
                array: true
            }
        },
        url: '/multiple/:ids',
        return: 'Molecule<A,D>[]',
    },
    delete_multiple: {
        method: types.RouteMethod.DELETE,
        action: client_1.default.types.AuthAction.WRITE,
        params: {
            ids: {
                array: true
            }
        },
        url: '/multiple/:ids',
        return: 'Molecule<A,D>[]',
    },
};
exports.media_routes = {
    upload: {
        method: types.RouteMethod.POST,
        action: client_1.default.types.AuthAction.WRITE,
        url: '/upload',
        return: 'Molecule<A,D>[]',
    },
    presigned: {
        method: types.RouteMethod.GET,
        action: client_1.default.types.AuthAction.WRITE,
        query: ['filename', 'size', 'type'],
        url: '/presigned',
        return: 'string',
    }
};
function add_media_routes() {
    const cloned_default_routes = {
        ...exports.media_routes,
        ...exports.default_routes
    };
    return cloned_default_routes;
}
exports.add_media_routes = add_media_routes;
// export function route_def<A extends schema.AtomName>(atom_name:A, route_name:schema.RouteName<A>)
//     :types.Book.Definition.Dock.Routes.Route{
//   const cloned_default_routes = add_media_routes();
//   return common_route_def(cloned_default_routes as any, atom_name, route_name);
// }
// export function atom_dock_with_defaults(
//   default_routes:types.Book.Definition.Dock.Routes,
//   atom_name:schema.AtomName
// ):types.Book.Definition.Dock{
//   return common_atom_dock_with_defaults(default_routes, atom_name);
// }
//# sourceMappingURL=client.js.map