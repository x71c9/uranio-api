/**
 * Web book types module
 *
 * @packageDocumentation
 */

// import {urn_response} from 'urn-lib';

// import {route_book} from 'urn_book';

import urn_core from 'urn_core';

export * from 'urn_core/types';

export type Book = urn_core.types.Book;

export namespace Book {
	
	export type Definition = urn_core.types.Book.Definition & {
		api: Definition.Api
	}
	
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

// export type RouteBook = {
//   [A in urn_core.Book.Definition.Api.Routes.Route.RouteRequesme]?: RouteBook.Routes
// }

// export namespace RouteBook {
	
//   export type Routes = {
//     [k:string]: Routes.Route
//   }
	
//   export namespace Routes {
		
//     export type Route = {
			
//       method: RouteMethod,
//       action: urn_core.types.AuthAction,
//       query: string[],
//       url: string,
//       call: (urn_request:RouteRequest) => Promise<urn_response.General>
			
//     }
		
//   }
// }


// export type RouteName<A extends urn_core.types.AtomName> =
//   A extends keyof typeof route_book ?
//   typeof route_book[A] extends RouteBook.Routes<A> ?
//   keyof typeof route_book[A] :
//   never :
//   never;


