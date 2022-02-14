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

import core_client from 'uranio-core/client';

import {RouteMethod} from './request';

import {schema} from '../sch/index';

export type Book = {
	[k in schema.AtomName]?: Book.Definition
}

// export type DockBook = {
//   [k in core_client.types.AtomName]: Book.Definition.Dock
// }

export namespace Book {
	
	// export type BasicDefinition =
	//   core_client.types.Book.BasicDefinition &
	//   { dock?: Definition.Dock }
	
	export type Definition =
		core_client.types.Book.Definition &
		{ dock?: Definition.Dock }
	
	// export type Definition =
	//   Book.BasicDefinition
	
	export namespace Definition {
		
		export type Dock = {
			url: string,
			auth_url?: string,
			routes?: Dock.Routes
		}
		
		export namespace Dock {
			
			export type Routes = {
				[k:string]: Routes.Route
			}
			
			export namespace Routes {
				
				export type Route = {
					method: RouteMethod
					action: core_client.types.AuthAction
					url: string
					query?: string[]
					params?: Params
					return?: any
				}
				
				export type Params = {
					[k:string]:{
						array?: boolean
					}
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
		// export import Properties = core_client.types.Book.Definition.Properties;
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		// export import Property = core_client.types.Book.Definition.Property;
		
		export type Property = core_client.types.Book.Definition.Property;
		
		export type Properties = core_client.types.Book.Definition.Properties;
		
		export namespace Property {
			export type ID = core_client.types.Book.Definition.Property.ID;
			export type Text = core_client.types.Book.Definition.Property.Text;
			export type LongText = core_client.types.Book.Definition.Property.LongText;
			export type String = core_client.types.Book.Definition.Property.String;
			export type Number = core_client.types.Book.Definition.Property.Number;
			export type Enum = core_client.types.Book.Definition.Property.Enum;
			export type Set = core_client.types.Book.Definition.Property.Set;
			export type DayTime = core_client.types.Book.Definition.Property.DayTime;
			export type Email = core_client.types.Book.Definition.Property.Email;
			export type Integer = core_client.types.Book.Definition.Property.Integer;
			export type Float = core_client.types.Book.Definition.Property.Float;
			export type Binary = core_client.types.Book.Definition.Property.Binary;
			export type Encrypted = core_client.types.Book.Definition.Property.Encrypted;
			export type Day = core_client.types.Book.Definition.Property.Day;
			export type Time = core_client.types.Book.Definition.Property.Time;
			export type EnumString = core_client.types.Book.Definition.Property.EnumString;
			export type EnumNumber = core_client.types.Book.Definition.Property.EnumNumber;
			export type SetString = core_client.types.Book.Definition.Property.SetNumber;
			export type SetNumber = core_client.types.Book.Definition.Property.SetString;
			export type Atom = core_client.types.Book.Definition.Property.Atom;
			export type AtomArray = core_client.types.Book.Definition.Property.AtomArray;
			export namespace Format {
				export type Float = core_client.types.Book.Definition.Property.Format.Float;
			}
			export namespace Validation {
				export type String = core_client.types.Book.Definition.Property.Validation.String;
				export type Number = core_client.types.Book.Definition.Property.Validation.Number;
				export type DayTime = core_client.types.Book.Definition.Property.Validation.DayTime;
				export type SetString = core_client.types.Book.Definition.Property.Validation.SetString;
				export type SetNumber = core_client.types.Book.Definition.Property.Validation.SetNumber;
				export type Atom = core_client.types.Book.Definition.Property.Validation.Atom;
			}
		}
		
	}
	
}
