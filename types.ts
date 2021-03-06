/**
 * Web book types module
 *
 * @packageDocumentation
 */

import urn_core from '../urn-core/';

export * from 'urn_core/types';

import * as required_books from './books';

export {required_books};

export type Book = {
	[k in urn_core.types.AtomName]?: Book.AtomDefinition<k>;
}

export namespace Book {
	
	export type Definition =
		urn_core.types.Book.Definition &
		{ api?: Definition.Api }
	
	export type AtomDefinition<A extends urn_core.types.AtomName> =
		Book.Definition &
		{ bll?: new(...args:any[]) => urn_core.bll.BLL<A>}
	
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

import {FullConfiguration as CoreFullConfiguration} from 'urn_core/types';

type RequiredConfigParams = {
	web_required_param: string
}

type OptionalConfigParam = {
	web_optional_param: string
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

export type RouteRequest = {
	atom_name: urn_core.types.AtomName,
	route_name: string,
	params: RouteRequestParams,
	query: RouteRequestQuery,
	body: any,
	ip: string,
	token_object?: urn_core.types.TokenObject,
	log?: urn_core.types.Atom<'request'>
}

type RouteRequestParams = {
	[k:string]: string
}

type RouteRequestQuery = {
	[k:string]: any
}


