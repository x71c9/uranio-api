/**
 * Client Book types module
 *
 * This module defines the type of the `atom_book` for the Client.
 *
 * In order to copy and reexport namespaces and types we use the syntax
 * `export import`.
 *
 * `type Book` must be re-defined.
 *
 * @packageDocumentation
 */

import urn_core_client from 'uranio-core/client';

import {RouteMethod} from './request';

export type Book = {
	[k in urn_core_client.types.AtomName]?: Book.Definition;
}

export type DockBook = {
	[k in urn_core_client.types.AtomName]: Book.Definition.Dock
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
					return?: any
				}
				
			}
			
		}
		
		/**
		 * ** NOTE **
		 * For some reason it is not possible to use the following syntax.
		 * NuxtJS will fail in the browser.
		 * All namespace and types must be re-defined.
		 */
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		// export import Properties = urn_core_client.types.Book.Definition.Properties;
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		// export import Property = urn_core_client.types.Book.Definition.Property;
		
		export type Property = urn_core_client.types.Book.Definition.Property;
		
		export type Properties = urn_core_client.types.Book.Definition.Properties;
		
		export namespace Property {
			export type ID = urn_core_client.types.Book.Definition.Property.ID;
			export type Text = urn_core_client.types.Book.Definition.Property.Text;
			export type LongText = urn_core_client.types.Book.Definition.Property.LongText;
			export type String = urn_core_client.types.Book.Definition.Property.String;
			export type Number = urn_core_client.types.Book.Definition.Property.Number;
			export type Enum = urn_core_client.types.Book.Definition.Property.Enum;
			export type Set = urn_core_client.types.Book.Definition.Property.Set;
			export type DayTime = urn_core_client.types.Book.Definition.Property.DayTime;
			export type Email = urn_core_client.types.Book.Definition.Property.Email;
			export type Integer = urn_core_client.types.Book.Definition.Property.Integer;
			export type Float = urn_core_client.types.Book.Definition.Property.Float;
			export type Binary = urn_core_client.types.Book.Definition.Property.Binary;
			export type Encrypted = urn_core_client.types.Book.Definition.Property.Encrypted;
			export type Day = urn_core_client.types.Book.Definition.Property.Day;
			export type Time = urn_core_client.types.Book.Definition.Property.Time;
			export type EnumString = urn_core_client.types.Book.Definition.Property.EnumString;
			export type EnumNumber = urn_core_client.types.Book.Definition.Property.EnumNumber;
			export type SetString = urn_core_client.types.Book.Definition.Property.SetNumber;
			export type SetNumber = urn_core_client.types.Book.Definition.Property.SetString;
			export type Atom = urn_core_client.types.Book.Definition.Property.Atom;
			export type AtomArray = urn_core_client.types.Book.Definition.Property.AtomArray;
			export namespace Format {
				export type Float = urn_core_client.types.Book.Definition.Property.Format.Float;
			}
			export namespace Validation {
				export type String = urn_core_client.types.Book.Definition.Property.Validation.String;
				export type Number = urn_core_client.types.Book.Definition.Property.Validation.Number;
				export type DayTime = urn_core_client.types.Book.Definition.Property.Validation.DayTime;
				export type SetString = urn_core_client.types.Book.Definition.Property.Validation.SetString;
				export type SetNumber = urn_core_client.types.Book.Definition.Property.Validation.SetNumber;
				export type Atom = urn_core_client.types.Book.Definition.Property.Validation.Atom;
			}
		}
		
	}
	
}
