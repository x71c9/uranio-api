/**
 * Client routes module
 *
 * @packageDocumentation
 */
import * as types from '../cln/types';
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
        readonly action: any;
        readonly url: "/count";
        readonly query: readonly ["filter"];
    };
    readonly find_one: {
        readonly method: types.RouteMethod.GET;
        readonly action: any;
        readonly url: "/first";
        readonly query: readonly ["filter", "options"];
    };
    readonly find: {
        readonly method: types.RouteMethod.GET;
        readonly action: any;
        readonly url: "/";
        readonly query: readonly ["filter", "options"];
    };
    readonly find_id: {
        readonly method: types.RouteMethod.GET;
        readonly action: any;
        readonly url: "/:id";
        readonly query: readonly ["options"];
    };
    readonly insert: {
        readonly method: types.RouteMethod.POST;
        readonly action: any;
        readonly url: "/";
    };
    readonly update: {
        readonly method: types.RouteMethod.POST;
        readonly action: any;
        readonly url: "/:id";
    };
    readonly delete: {
        readonly method: types.RouteMethod.DELETE;
        readonly action: any;
        readonly url: "/:id";
    };
    readonly insert_multiple: {
        readonly method: types.RouteMethod.POST;
        readonly action: any;
        readonly url: "/multiple";
    };
    readonly update_multiple: {
        readonly method: types.RouteMethod.POST;
        readonly action: any;
        readonly params: {
            readonly ids: {
                readonly array: true;
            };
        };
        readonly url: "/multiple/:ids";
    };
    readonly delete_multiple: {
        readonly method: types.RouteMethod.DELETE;
        readonly action: any;
        readonly params: {
            readonly ids: {
                readonly array: true;
            };
        };
        readonly url: "/multiple/:ids";
    };
};
export declare function add_media_routes(): typeof default_routes;
