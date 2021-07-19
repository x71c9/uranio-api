/**
 * Web book types module
 *
 * @packageDocumentation
 */

import urn_core from 'uranio-core';

export * from 'uranio-core/types';

import {FullConfiguration as CoreFullConfiguration} from 'uranio-core/types';

import {ServiceName} from './service/';

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
					
					export type Call = (route_request: RouteRequest) => any
					
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
	service: ServiceName
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

export type Request = {
	params: RouteRequestParams,
	query: RouteRequestQuery,
	body: any,
	ip: string
}

export type RouteRequest = {
	atom_name: urn_core.types.AtomName,
	route_name: keyof Book.Definition.Api.Routes,
	params: RouteRequestParams,
	query: RouteRequestQuery,
	body: any,
	ip: string,
	headers?: RouteRequestHeaders,
	passport?: urn_core.types.Passport,
	// log?: urn_core.types.Atom<'request'>
}

type RouteRequestHeaders = {
	[k:string]: string
}

type RouteRequestParams = {
	[k:string]: string
}

type RouteRequestQuery = {
	[k:string]: any
}


