/**
 * Client routes module
 *
 * @packageDocumentation
 */
import core from 'uranio-core/client';
import * as types from '../client/types';
/**
 *
 * NOTE:
 *
 * If the default routes change, they must change also in:
 * - routes/server.ts
 * - uranio/urn-cli/cmd/hook.ts
 *
 */
export declare const default_routes: {
    readonly count: {
        readonly method: types.RouteMethod.GET;
        readonly action: core.types.AuthAction.READ;
        readonly url: "/count";
        readonly return: "number";
        readonly query: readonly ["filter"];
    };
    readonly find_one: {
        readonly method: types.RouteMethod.GET;
        readonly action: core.types.AuthAction.READ;
        readonly url: "/first";
        readonly return: "Molecule<A,D>";
        readonly query: readonly ["filter", "options"];
    };
    readonly find: {
        readonly method: types.RouteMethod.GET;
        readonly action: core.types.AuthAction.READ;
        readonly url: "/";
        readonly return: "Molecule<A,D>[]";
        readonly query: readonly ["filter", "options"];
    };
    readonly find_id: {
        readonly method: types.RouteMethod.GET;
        readonly action: core.types.AuthAction.READ;
        readonly url: "/:id";
        readonly return: "Molecule<A,D>";
        readonly query: readonly ["options"];
    };
    readonly insert: {
        readonly method: types.RouteMethod.POST;
        readonly action: core.types.AuthAction.WRITE;
        readonly url: "/";
        readonly return: "Molecule<A,D>";
    };
    readonly update: {
        readonly method: types.RouteMethod.POST;
        readonly action: core.types.AuthAction.WRITE;
        readonly url: "/:id";
        readonly return: "Molecule<A,D>";
    };
    readonly delete: {
        readonly method: types.RouteMethod.DELETE;
        readonly action: core.types.AuthAction.WRITE;
        readonly url: "/:id";
        readonly return: "Molecule<A,D>";
    };
    readonly insert_multiple: {
        readonly method: types.RouteMethod.POST;
        readonly action: core.types.AuthAction.WRITE;
        readonly url: "/multiple";
        readonly return: "Molecule<A,D>[]";
    };
    readonly update_multiple: {
        readonly method: types.RouteMethod.POST;
        readonly action: core.types.AuthAction.WRITE;
        readonly params: {
            readonly ids: {
                readonly array: true;
            };
        };
        readonly url: "/multiple/:ids";
        readonly return: "Molecule<A,D>[]";
    };
    readonly delete_multiple: {
        readonly method: types.RouteMethod.DELETE;
        readonly action: core.types.AuthAction.WRITE;
        readonly params: {
            readonly ids: {
                readonly array: true;
            };
        };
        readonly url: "/multiple/:ids";
        readonly return: "Molecule<A,D>[]";
    };
    readonly search_count: {
        readonly method: types.RouteMethod.GET;
        readonly action: core.types.AuthAction.READ;
        readonly url: "/search/count/:q";
        readonly return: "number";
    };
    readonly search: {
        readonly method: types.RouteMethod.GET;
        readonly action: core.types.AuthAction.READ;
        readonly url: "/search/:q";
        readonly return: "Molecule<A,D>[]";
        readonly query: readonly ["options"];
    };
};
export declare const media_routes: {
    readonly upload: {
        readonly method: types.RouteMethod.POST;
        readonly action: core.types.AuthAction.WRITE;
        readonly url: "/upload";
        readonly return: "Molecule<A,D>[]";
    };
    readonly presigned: {
        readonly method: types.RouteMethod.GET;
        readonly action: core.types.AuthAction.WRITE;
        readonly query: readonly ["filename", "size", "type"];
        readonly url: "/presigned";
        readonly return: "string";
    };
};
export declare function add_media_routes(): typeof default_routes;
