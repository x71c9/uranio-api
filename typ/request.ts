/**
 * Request types module
 *
 * @packageDocumentation
 */

import urn_core from 'uranio-core';

export const enum RouteMethod {
	GET = 'GET',
	POST = 'POST',
	DELETE = 'DELETE'
}

export namespace Api {
	
	export type Request =
		Request.Paths & {
		method: RouteMethod,
		atom_name: urn_core.types.AtomName
		route_name: string
		is_auth: boolean
		auth_action: urn_core.types.AuthAction
		params: Request.Params
		query: Request.Query
		body?: any
		headers?: Request.Headers
		ip?: string,
		passport?: urn_core.types.Passport
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
		
		export type Params = {
			[k:string]: string |  undefined
		}
		
		export type Query = {
			[k:string]: any
		}
		
	}
	
}

export type AuthHandler = (api_request:Api.Request) => Promise<string>;

