/**
 * Request types module
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

import {schema} from '../sch/server';

export enum RouteMethod {
	GET = 'GET',
	POST = 'POST',
	DELETE = 'DELETE'
}

export namespace Api {
	
	export type AuthResponse = {
		token?: string,
		// headers?: {
		// 	[k:string]: string | boolean
		// },
		// multi_value_headers?: {
		// 	"Set-Cookie": string[]
		// }
	}
	
	export type Request<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth = 0> =
		Request.Paths & {
		method: RouteMethod
		atom_name: A
		route_name: R
		is_auth: boolean
		auth_action: core.types.AuthAction
		params: Request.Params<A,R>
		query: Request.Query<A,R,D>
		body?: Request.Body<A,R>
		file?: Request.File
		headers?: Request.Headers
		ip?: string,
		passport?: core.types.Passport
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
		
		export type Params<A extends schema.AtomName, R extends schema.RouteName<A>> = {
			[k in RouteParam<A,R>]: string |  undefined
		}
		
		export type Query<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth = 0> = {
			[k in schema.RouteQueryParam<A,R>]?: RouteQueryParamValue<A,R,k,D>
		}
		
		export type Body<A extends schema.AtomName, R extends schema.RouteName<A>> =
			R extends 'insert' ? schema.AtomShape<A> :
			R extends 'update' ? schema.AtomShape<A> :
			R extends 'insert_multiple' ? schema.AtomShape<A>[] :
			R extends 'update_multiple' ? schema.AtomShape<A> :
			any
		
	}
	
}

export type RouteQueryParamValue<A extends schema.AtomName, R extends schema.RouteName<A>, K extends schema.RouteQueryParam<A,R>, D extends schema.Depth = 0> =
	K extends 'filter' ? schema.Query<A> :
	K extends 'options' ? schema.Query.Options<A,D> :
	any;


export type AuthHandler<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth = 0> =
	(api_request:Api.Request<A,R,D>) => Promise<string>;


// type DefaultRouteURL<A extends schema.AtomName, R extends schema.RouteName<A>> =
//   R extends keyof typeof routes.default_routes ?
//   'url' extends keyof typeof routes.default_routes[R] ?
//   typeof routes.default_routes[R]['url'] :
//   never :
//   never;

// type CustomRouteURL<A extends schema.AtomName, R extends schema.RouteName<A>> =
//   'dock' extends keyof typeof dock_book[A] ?
//   'routes' extends keyof typeof dock_book[A]['dock'] ?
//   R extends keyof typeof dock_book[A]['dock']['routes'] ?
//   'url' extends keyof typeof dock_book[A]['dock']['routes'][R] ?
//   typeof dock_book[A]['dock']['routes'][R]['url'] :
//   never :
//   never :
//   never :
//   never;

// type schema.RouteURL<A extends schema.AtomName, R extends schema.RouteName<A>> =
//   R extends schema.RouteCustomName<A> ? schema.CustomRouteURL<A,R> :
//   R extends schema.RouteName<A> ? DefaultRouteURL<A,R> :
//   never

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

export type RouteParam<A extends schema.AtomName, R extends schema.RouteName<A>> =
	schema.RouteURL<A,R> extends string ?
	ExtractParamFrom<schema.RouteURL<A,R>> :
	never;

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

// export const c:schema.RouteQueryParam<'media','find'> = 'options';
// export const d:RouteQueryParamValue<'media','find','filter',0> = {filename: ''};
// export const w:schema.Query<'media'> = {filename: ''};

// export const e:Api.Request.Query<'media', 'find', 0> = {filter: {filename: ''}};


