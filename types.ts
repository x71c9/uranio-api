/**
 * Web book types module
 *
 * @packageDocumentation
 */

import urn_core from 'uranio-core';

export * from 'uranio-core/types';

import {FullConfiguration as CoreFullConfiguration} from 'uranio-core/types';

import {ServiceName} from './service/';

import {LambdaName} from './lambda/';

export type Book = {
	[k in urn_core.types.AtomName]?: Book.Definition<k>;
}

export namespace Book {
	
	export type BasicDefinition =
		urn_core.types.Book.BasicDefinition &
		{ api?: Definition.Api }
	
	export type Definition<A extends urn_core.types.AtomName> =
		Book.BasicDefinition &
		{ bll?: (passport?:urn_core.types.Passport) => urn_core.bll.BLL<A> }
	
	export namespace Definition {
		
		export type Api = {
			url: string,
			auth?: string,
			routes?: Api.Routes
		}
		
		export namespace Api {
			
			export type Routes = {
				[k:string]: Routes.Route
			}
			
			export namespace Routes {
				
				export type Route = {
					method: RouteMethod,
					action: urn_core.types.AuthAction,
					url: string,
					query?: string[],
					call: Route.Call
				}
				
				export namespace Route {
					
					export type Call = (route_request: ApiRequest) => any
					
				}
				
			}
			
		}
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		export import Security = urn_core.types.Book.Definition.Security;
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		export import Properties = urn_core.types.Book.Definition.Properties;
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		export import Property = urn_core.types.Book.Definition.Property;
		
	}
	
}

type RequiredConfigParams = {
	service: ServiceName,
	lambda: LambdaName,
	prefix_api: string,
	prefix_log: string
}

type OptionalConfigParam = {
	service_port: number
	request_auto_limit: number,
}

export type Configuration =
	CoreFullConfiguration &
	RequiredConfigParams &
	Partial<OptionalConfigParam>;

export type FullConfiguration =
	CoreFullConfiguration &
	RequiredConfigParams &
	OptionalConfigParam;

export const enum RouteMethod {
	GET = 'GET',
	POST = 'POST',
	DELETE = 'DELETE'
}

export type ApiRequestPaths = {
	full_path: string
	route_path: string
	atom_path: string
	connection_path: string
}

export type ApiRequest =
	ApiRequestPaths & {
	method: RouteMethod,
	atom_name: urn_core.types.AtomName
	route_name: string
	is_auth: boolean
	auth_action: urn_core.types.AuthAction
	params: ApiRequestParams
	query: ApiRequestQuery
	body?: any
	headers?: ApiRequestHeaders
	ip?: string,
	passport?: urn_core.types.Passport
}

// export type RouteRequest = ApiRequest & {
//   passport?: urn_core.types.Passport
// }

export type ApiRequestHeaders = {
	[k:string]: string | undefined
}

export type ApiRequestParams = {
	[k:string]: string |  undefined
}

export type ApiRequestQuery = {
	[k:string]: any
}

export type LogBlls = {
	req: urn_core.bll.BLL<'request'>,
	err: urn_core.bll.BLL<'error'>
}

export type AuthHandler = (api_request:ApiRequest) => Promise<string>;

