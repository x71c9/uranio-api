"use strict";
/**
 * Request types module
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteMethod = void 0;
var RouteMethod;
(function (RouteMethod) {
    RouteMethod["GET"] = "GET";
    RouteMethod["POST"] = "POST";
    RouteMethod["DELETE"] = "DELETE";
})(RouteMethod = exports.RouteMethod || (exports.RouteMethod = {}));
// export const a:RouteParam<'user', 'find_id'> = '/s';
// type ArrayElement<ArrayType extends readonly unknown[]> =
//   ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
// type DefaultRouteQueryParamArray<A extends schema.AtomName, R extends schema.RouteName<A>> =
//   R extends keyof typeof routes.default_routes ?
//   'query' extends keyof typeof routes.default_routes[R] ?
//   typeof routes.default_routes[R]['query'] :
//   never :
//   never;
// type DefaultRouteQuery<A extends schema.AtomName, R extends schema.RouteName<A>> =
//   DefaultRouteQueryParamArray<A,R> extends readonly unknown[] ?
//   ArrayElement<DefaultRouteQueryParamArray<A,R>> :
//   never;
// export const b:DefaultRouteQueryParam<'user', 'find'> = 's';
// type CustomRouteQueryParamArray<A extends schema.AtomName, R extends schema.RouteName<A>> =
//   'dock' extends keyof typeof dock_book[A] ?
//   'routes' extends keyof typeof dock_book[A]['dock'] ?
//   R extends keyof typeof dock_book[A]['dock']['routes'] ?
//   'query' extends keyof typeof dock_book[A]['dock']['routes'][R] ?
//   typeof dock_book[A]['dock']['routes'][R]['query'] :
//   never :
//   never :
//   never :
//   never;
// type CustomRouteQueryParam<A extends schema.AtomName, R extends schema.RouteCustomName<A>> =
//   schema.CustomRouteQueryParamArray<A,R> extends readonly unknown[] ?
//   ArrayElement<schema.CustomRouteQueryParamArray<A,R>> :
//   never;
/**
 * NOTE:
 * The `extends string` check is needed so that when the type is wrong tsc error
 * will show which strings are valid.
 */
// export type RouteQueryParam<A extends schema.AtomName, R extends schema.RouteName<A>> =
//   R extends schema.RouteCustomName<A> ?
//   CustomRouteQueryParam<A,R> extends string ?
//   CustomRouteQueryParam<A,R> :
//   never :
//   DefaultRouteQuery<A, R>
// export const c:RouteQueryParam<'user', 'find'> = 'options';
// type DefaultRouteQueryParam<R extends RouteDefaultName> =
//   R extends 'count' ? 'filter' :
//   R extends 'find_id' ? 'options' :
//   never
// export type RQP<A extends schema.AtomName, R extends schema.RouteName<A>> =
//   R extends DefaultRouteURL<A,R> ? DefaultRouteQueryParam<R> :
//   CustomRouteQueryParam<A,R> extends string ? CustomRouteQueryParam<A,R> :
//   never;
// type CustomRouteQueryParam<A extends schema.AtomName, R extends schema.RouteName<A>> =
// const a = ['a','b'];
// type B = ArrayElement<typeof a>;
// export const n:B = 'c';
//# sourceMappingURL=request.js.map