/**
 * Client Book types module
 *
 * This module defines the type of the `atom_book` for the Client.
 *
 * In order to copy and reexport namespaces and types we use the syntax
 * `export import`.
 *
 * `type Book` must be redifined.
 *
 * @packageDocumentation
 */

import urn_core_client from 'uranio-core/client';

import {RouteMethod} from './request';

export type Book = {
	[k in urn_core_client.types.AtomName]?: Book.Definition;
}

export namespace Book {
	
	export type BasicDefinition =
		urn_core_client.types.Book.BasicDefinition &
		{ dock?: Definition.Dock }
	
	export type Definition =
		Book.BasicDefinition
	
	export namespace Definition {
		
		export type Dock = {
			url: string,
			auth?: string,
			routes?: Dock.Routes
		}
		
		export namespace Dock {
			
			export type Routes = {
				[k:string]: Routes.Route
			}
			
			export namespace Routes {
				
				export type Route = {
					method: RouteMethod,
					action: urn_core_client.types.AuthAction,
					url: string,
					query?: string[],
				}
				
			}
			
		}
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		export import Properties = urn_core_client.types.Book.Definition.Properties;
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		export import Property = urn_core_client.types.Book.Definition.Property;
		
	}
	
}
