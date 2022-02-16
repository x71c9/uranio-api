/**
 * Request types module
 *
 * @packageDocumentation
 */
/// <reference types="node" />
import core from 'uranio-core';
import { schema } from '../sch/index';
export declare enum RouteMethod {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE"
}
export declare namespace Api {
    type AuthResponse = {
        token?: string;
        headers?: {
            [k: string]: string | boolean;
        };
        multi_value_headers?: {
            "Set-Cookie": string[];
        };
    };
    type Request<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth = 0> = Request.Paths & {
        method: RouteMethod;
        atom_name: A;
        route_name: R;
        is_auth: boolean;
        auth_action: core.types.AuthAction;
        params: Request.Params<A, R>;
        query: Request.Query<A, R, D>;
        body?: Request.Body<A, R>;
        file?: Request.File;
        headers?: Request.Headers;
        ip?: string;
        passport?: core.types.Passport;
    };
    namespace Request {
        type File = {
            name: string;
            data: Buffer | ArrayBuffer | Blob;
            size: number;
            mime_type: string;
        };
        type Paths = {
            full_path: string;
            route_path: string;
            atom_path: string;
            connection_path: string;
        };
        type Headers = {
            [k: string]: string | undefined;
        };
        type Params<A extends schema.AtomName, R extends schema.RouteName<A>> = {
            [k in RouteParam<A, R>]: string | undefined;
        };
        type Query<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth = 0> = {
            [k in schema.RouteQueryParam<A, R>]?: RouteQueryParamValue<A, R, k, D>;
        };
        type Body<A extends schema.AtomName, R extends schema.RouteName<A>> = R extends 'insert' ? schema.AtomShape<A> : R extends 'update' ? schema.AtomShape<A> : R extends 'insert_multiple' ? schema.AtomShape<A>[] : R extends 'update_multiple' ? schema.AtomShape<A> : any;
    }
}
export declare type RouteQueryParamValue<A extends schema.AtomName, R extends schema.RouteName<A>, K extends schema.RouteQueryParam<A, R>, D extends schema.Depth = 0> = K extends 'filter' ? schema.Query<A> : K extends 'options' ? schema.Query.Options<A, D> : any;
export declare type AuthHandler<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth = 0> = (api_request: Api.Request<A, R, D>) => Promise<string>;
declare type ExtractParamFrom<URI extends string> = URI extends `/:${infer Param1}/:${infer Param2}/:${infer Param3}/:${infer Param4}` | `/${infer _Prefix}/:${infer Param1}/:${infer Param2}/:${infer Param3}/:${infer Param4}` ? Param1 | Param2 | Param3 | Param4 : URI extends `/:${infer Param1}/:${infer Param2}/:${infer Param3}` | `/${infer _Prefix}/:${infer Param1}/:${infer Param2}/:${infer Param3}` ? Param1 | Param2 | Param3 : URI extends `/:${infer Param1}/:${infer Param2}` | `/${infer _Prefix}/:${infer Param1}/:${infer Param2}` ? Param1 | Param2 : URI extends `/:${infer Param}` | `/${infer _Prefix}/:${infer Param}` ? Param : never;
export declare type RouteParam<A extends schema.AtomName, R extends schema.RouteName<A>> = schema.RouteURL<A, R> extends string ? ExtractParamFrom<schema.RouteURL<A, R>> : never;
export {};
/**
 * NOTE:
 * The `extends string` check is needed so that when the type is wrong tsc error
 * will show which strings are valid.
 */
