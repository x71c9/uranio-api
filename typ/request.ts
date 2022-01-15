/**
 * Request types module
 *
 * @packageDocumentation
 */

// import {routes_book} from 'uranio-books/routes';
import {dock_book} from 'uranio-books/dock';

import * as types from '../cln/types';

import * as routes from '../routes/client';

import {RouteName} from './route';

export const enum RouteMethod {
	GET = 'GET',
	POST = 'POST',
	DELETE = 'DELETE'
}

export namespace Api {
	
	export type AuthResponse = {
		token?: string,
		headers?: {
			[k:string]: string | boolean
		},
		multi_value_headers?: {
			"Set-Cookie": string[]
		}
	}
	
	export type Request<A extends types.AtomName, R extends RouteName<A>, D extends types.Depth = 0> =
		Request.Paths & {
		method: RouteMethod
		atom_name: A
		route_name: R
		is_auth: boolean
		auth_action: types.AuthAction
		params: Request.Params<A,R>
		query: Request.Query<A,R,D>
		body?: any
		file?: Request.File
		headers?: Request.Headers
		ip?: string,
		passport?: types.Passport
	}
	
	export namespace Request {
		
		export type File = {
			name: string
			data: Buffer | ArrayBuffer | Blob
			size: number
			mime_type: string
		}
		
		export type Paths = {
			full_path: string
			route_path: string
			atom_path: string
			connection_path: string
		}
		
		export type Headers = {
			[k:string]: string | undefined
		}
		
		export type Params<A extends types.AtomName, R extends RouteName<A>> = {
			[k in RouteParam<A,R>]: string |  undefined
		}
		
		export type Query<A extends types.AtomName, R extends RouteName<A>, D extends types.Depth = 0> = {
			[k in RouteQueryParam<A,R>]?: RouteQueryParamValue<A,R,k,D>
		}
		
	}
	
}

export type RouteQueryParamValue<A extends types.AtomName, R extends RouteName<A>, K extends RouteQueryParam<A,R>, D extends types.Depth = 0> =
	K extends 'filter' ? types.Query<A> :
	K extends 'options' ? types.Query.Options<A,D> :
	any;


export type AuthHandler<A extends types.AtomName, R extends RouteName<A>, D extends types.Depth = 0> =
	(api_request:Api.Request<A,R,D>) => Promise<string>;


type DefaultRouteURL<A extends types.AtomName, R extends RouteName<A>> =
	R extends keyof typeof routes.default_routes ?
	'url' extends keyof typeof routes.default_routes[R] ?
	typeof routes.default_routes[R]['url'] :
	never :
	never;

type CustomRouteURL<A extends types.AtomName, R extends RouteName<A>> =
	'dock' extends keyof typeof dock_book[A] ?
	'routes' extends keyof typeof dock_book[A]['dock'] ?
	R extends keyof typeof dock_book[A]['dock']['routes'] ?
	'url' extends keyof typeof dock_book[A]['dock']['routes'][R] ?
	typeof dock_book[A]['dock']['routes'][R]['url'] :
	never :
	never :
	never :
	never;

type RouteURL<A extends types.AtomName, R extends RouteName<A>> =
	DefaultRouteURL<A,R> | CustomRouteURL<A,R>;

type ExtractParamFrom<URI extends string> =
	URI extends
		`/:${infer Param1}/:${infer Param2}/:${infer Param3}/:${infer Param4}` |
		`/${infer _Prefix}/:${infer Param1}/:${infer Param2}/:${infer Param3}/:${infer Param4}` ?
		Param1 | Param2 | Param3 | Param4 :
	URI extends
		`/:${infer Param1}/:${infer Param2}/:${infer Param3}` |
		`/${infer _Prefix}/:${infer Param1}/:${infer Param2}/:${infer Param3}` ?
		Param1 | Param2 | Param3 :
	URI extends
		`/:${infer Param1}/:${infer Param2}` |
		`/${infer _Prefix}/:${infer Param1}/:${infer Param2}` ?
		Param1 | Param2 :
	URI extends
		`/:${infer Param}` |
		`/${infer _Prefix}/:${infer Param}` ?
	Param :
	never;

export type RouteParam<A extends types.AtomName, R extends RouteName<A>> =
	RouteURL<A,R> extends string ?
	ExtractParamFrom<RouteURL<A,R>> :
	never;

// export const a:RouteParam<'user', 'find_id'> = '/s';

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type DefaultRouteQueryParamArray<A extends types.AtomName, R extends RouteName<A>> =
	R extends keyof typeof routes.default_routes ?
	'query' extends keyof typeof routes.default_routes[R] ?
	typeof routes.default_routes[R]['query'] :
	never :
	never;

type DefaultRouteQuery<A extends types.AtomName, R extends RouteName<A>> =
	DefaultRouteQueryParamArray<A,R> extends readonly unknown[] ?
	ArrayElement<DefaultRouteQueryParamArray<A,R>> :
	never;

// export const b:DefaultRouteQueryParam<'user', 'find'> = 's';

type CustomRouteQueryParamArray<A extends types.AtomName, R extends RouteName<A>> =
	'dock' extends keyof typeof dock_book[A] ?
	'routes' extends keyof typeof dock_book[A]['dock'] ?
	R extends keyof typeof dock_book[A]['dock']['routes'] ?
	'query' extends keyof typeof dock_book[A]['dock']['routes'][R] ?
	typeof dock_book[A]['dock']['routes'][R]['query'] :
	never :
	never :
	never :
	never;

type CustomRouteQueryParam<A extends types.AtomName, R extends RouteName<A>> =
	CustomRouteQueryParamArray<A,R> extends readonly unknown[] ?
	ArrayElement<CustomRouteQueryParamArray<A,R>> :
	never;

/**
 * NOTE:
 * The `extends string` check is needed so that when the type is wrong tsc error
 * will show which strings are valid.
 */
export type RouteQueryParam<A extends types.AtomName, R extends RouteName<A>> =
	DefaultRouteQuery<A,R> | CustomRouteQueryParam<A,R> extends string ?
	DefaultRouteQuery<A,R> | CustomRouteQueryParam<A,R> :
	never;

// export const c:RouteQueryParam<'user', 'find'> = 'option';


