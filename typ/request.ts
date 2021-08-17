/**
 * Request types module
 *
 * @packageDocumentation
 */

import urn_core_client from 'uranio-core/client';

import {api_book} from 'uranio-books-client/api';

import * as routes from '../routes/client';

import {RouteName} from './route';

export const enum RouteMethod {
	GET = 'GET',
	POST = 'POST',
	DELETE = 'DELETE'
}

export namespace Api {
	
	export type Request<A extends urn_core_client.types.AtomName, R extends RouteName<A>> =
		Request.Paths & {
		method: RouteMethod,
		atom_name: urn_core_client.types.AtomName
		route_name: string
		is_auth: boolean
		auth_action: urn_core_client.types.AuthAction
		params: Request.Params<A,R>
		query: Request.Query<A,R>
		body?: any
		headers?: Request.Headers
		ip?: string,
		passport?: urn_core_client.types.Passport
	}
	
	export namespace Request {
		
		export type Paths = {
			full_path: string
			route_path: string
			atom_path: string
			connection_path: string
		}
		
		export type Headers = {
			[k:string]: string | undefined
		}
		
		export type Params<A extends urn_core_client.types.AtomName, R extends RouteName<A>> = {
			[k in RouteParam<A,R>]: string |  undefined
		}
		
		export type Query<A extends urn_core_client.types.AtomName, R extends RouteName<A>> = {
			[k in RouteQuery<A,R>]?: RouteQueryValue<A,R,k>
		}
		
	}
	
}

export type RouteQueryValue<A extends urn_core_client.types.AtomName, R extends RouteName<A>, K extends RouteQuery<A,R>> =
	K extends 'filter' ? urn_core_client.types.Query<A> :
	K extends 'options' ? urn_core_client.types.Query.Options<A> :
	any;


export type AuthHandler<A extends urn_core_client.types.AtomName, R extends RouteName<A>> =
	(api_request:Api.Request<A,R>) => Promise<string>;


type DefaultRouteURL<A extends urn_core_client.types.AtomName, R extends RouteName<A>> =
	R extends keyof typeof routes.default_routes ?
	'url' extends keyof typeof routes.default_routes[R] ?
	typeof routes.default_routes[R]['url'] :
	never :
	never;

type CustomRouteURL<A extends urn_core_client.types.AtomName, R extends RouteName<A>> =
	'routes' extends keyof typeof api_book[A]['api'] ?
	R extends keyof typeof api_book[A]['api']['routes'] ?
	'url' extends keyof typeof api_book[A]['api']['routes'][R] ?
	typeof api_book[A]['api']['routes'][R]['url'] :
	never :
	never :
	never;

type RouteURL<A extends urn_core_client.types.AtomName, R extends RouteName<A>> =
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

export type RouteParam<A extends urn_core_client.types.AtomName, R extends RouteName<A>> =
	RouteURL<A,R> extends string ?
	ExtractParamFrom<RouteURL<A,R>> :
	never;

// export const a:RouteParam<'user', 'find_id'> = '/s';

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type DefaultRouteQueryArray<A extends urn_core_client.types.AtomName, R extends RouteName<A>> =
	R extends keyof typeof routes.default_routes ?
	'query' extends keyof typeof routes.default_routes[R] ?
	typeof routes.default_routes[R]['query'] :
	never :
	never;

type DefaultRouteQuery<A extends urn_core_client.types.AtomName, R extends RouteName<A>> =
	DefaultRouteQueryArray<A,R> extends readonly unknown[] ?
	ArrayElement<DefaultRouteQueryArray<A,R>> :
	never;

// export const b:DefaultRouteQuery<'user', 'find'> = 's';

type CustomRouteQueryArray<A extends urn_core_client.types.AtomName, R extends RouteName<A>> =
	'routes' extends keyof typeof api_book[A]['api'] ?
	R extends keyof typeof api_book[A]['api']['routes'] ?
	'query' extends keyof typeof api_book[A]['api']['routes'][R] ?
	typeof api_book[A]['api']['routes'][R]['query'] :
	never :
	never :
	never;

type CustomRouteQuery<A extends urn_core_client.types.AtomName, R extends RouteName<A>> =
	CustomRouteQueryArray<A,R> extends readonly unknown[] ?
	ArrayElement<CustomRouteQueryArray<A,R>> :
	never;

/**
 * NOTE:
 * The `extends string` check is needed so that when the type is wrong tsc error
 * will show which strings are valid.
 */
export type RouteQuery<A extends urn_core_client.types.AtomName, R extends RouteName<A>> =
	DefaultRouteQuery<A,R> | CustomRouteQuery<A,R> extends string ?
	DefaultRouteQuery<A,R> | CustomRouteQuery<A,R> :
	never;

// export const c:RouteQuery<'user', 'find'> = 'option';


