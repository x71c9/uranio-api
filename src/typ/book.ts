/**
 * Server book type module
 *
 * This module defines the type of the `atom_book` for the Server.
 * It extends the defintion of the Client Book type.
 *
 * In order to copy and reexport namespaces and types we use the syntax
 * `export import`.
 *
 * `type Book` must be re-defined.
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

import * as book_cln from './book_cln';

import {Api as ApiRequest} from './request';

import {schema} from '../sch/server';

export type Book = {
	[k in schema.AtomName]?: Book.Definition<k>;
}

export namespace Book {
	
	export type Definition<A extends schema.AtomName> =
		core.types.Book.Definition<A> & {
			bll?: Definition.Bll<A>,
			dock?: Definition.Dock<A>
		}
	
	export namespace Definition {
		
		export type Bll<A extends schema.AtomName> = core.types.Book.Definition.Bll<A>;
		// export type Bll = core.types.Book.Definition.Bll;
		
		export type Dock<A extends schema.AtomName> =
			Omit<book_cln.Book.Definition.Dock, 'routes'> & {
				routes?: Dock.Routes<A>
			};
		
		export namespace Dock {
			
			export type Routes<A extends schema.AtomName> = {
				[k in schema.RouteName<A>]?: Routes.Route<A,k>
			}
			
			export namespace Routes {
				
				export type Route<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth = 0> =
					book_cln.Book.Definition.Dock.Routes.Route & {
						call?: Route.Call<A, R, D>,
					}
				
				export namespace Route {
					
					export type Call<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth = 0> =
						(route_request: ApiRequest.Request<A,R,D>) => schema.Response<A,R,D>
					
				}
				
			}
		}
		
		export type Security = book_cln.Book.Definition.Security;
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		// export import Properties = core.types.Book.Definition.Properties;
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		// export import Property = core.types.Book.Definition.Property;
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		// export import Security = core.types.Book.Definition.Security;
		
		export type Property = book_cln.Book.Definition.Property;
		
		export type Properties = book_cln.Book.Definition.Properties;
		
		export namespace Property {
			export type ID = book_cln.Book.Definition.Property.ID;
			export type Text = book_cln.Book.Definition.Property.Text;
			export type LongText = book_cln.Book.Definition.Property.LongText;
			export type String = book_cln.Book.Definition.Property.String;
			export type Number = book_cln.Book.Definition.Property.Number;
			export type Enum = book_cln.Book.Definition.Property.Enum;
			export type Set = book_cln.Book.Definition.Property.Set;
			export type DayTime = book_cln.Book.Definition.Property.DayTime;
			export type Email = book_cln.Book.Definition.Property.Email;
			export type Integer = book_cln.Book.Definition.Property.Integer;
			export type Float = book_cln.Book.Definition.Property.Float;
			export type Binary = book_cln.Book.Definition.Property.Binary;
			export type Encrypted = book_cln.Book.Definition.Property.Encrypted;
			export type Day = book_cln.Book.Definition.Property.Day;
			export type Time = book_cln.Book.Definition.Property.Time;
			export type EnumString = book_cln.Book.Definition.Property.EnumString;
			export type EnumNumber = book_cln.Book.Definition.Property.EnumNumber;
			export type SetString = book_cln.Book.Definition.Property.SetNumber;
			export type SetNumber = book_cln.Book.Definition.Property.SetString;
			export type Atom = book_cln.Book.Definition.Property.Atom;
			export type AtomArray = book_cln.Book.Definition.Property.AtomArray;
			export namespace Format {
				export type Float = book_cln.Book.Definition.Property.Format.Float;
			}
			export namespace Validation {
				export type String = book_cln.Book.Definition.Property.Validation.String;
				export type Number = book_cln.Book.Definition.Property.Validation.Number;
				export type DayTime = book_cln.Book.Definition.Property.Validation.DayTime;
				export type SetString = book_cln.Book.Definition.Property.Validation.SetString;
				export type SetNumber = book_cln.Book.Definition.Property.Validation.SetNumber;
				export type Atom = book_cln.Book.Definition.Property.Validation.Atom;
			}
		}
		
	}
	
}

// type RouteOfRoute<A extends schema.AtomName, k extends schema.RouteName<A>> =
//   book_cln.Book.Definition.Dock.Routes.Route & {
//     call?: Book.Definition.Dock.Routes.Route.Call<A, k>
//   }


