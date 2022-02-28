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
import { RouteMethod } from './request_cln';
export declare type Book = {
    [k: string]: Book.Definition;
};
export declare namespace Book {
    type Definition = core_client.types.Book.Definition & {
        dock?: Definition.Dock;
    };
    namespace Definition {
        type Dock = {
            url: string;
            auth_url?: string;
            routes?: Dock.Routes;
        };
        namespace Dock {
            type Routes = {
                [k: string]: Routes.Route;
            };
            namespace Routes {
                type Route = {
                    method: RouteMethod;
                    action: core_client.types.AuthAction;
                    url: string;
                    query?: string[];
                    params?: Params;
                    return?: string;
                };
                type Params = {
                    [k: string]: {
                        array?: boolean;
                    };
                };
            }
        }
        type Security = core_client.types.Book.Definition.Security;
        /**
         * ** NOTE **
         * For some reason it is not possible to use the following syntax.
         * NuxtJS will fail in the browser.
         * All namespace and types must be re-defined.
         */
        type Property = core_client.types.Book.Definition.Property;
        type Properties = core_client.types.Book.Definition.Properties;
        namespace Property {
            type ID = core_client.types.Book.Definition.Property.ID;
            type Text = core_client.types.Book.Definition.Property.Text;
            type LongText = core_client.types.Book.Definition.Property.LongText;
            type String = core_client.types.Book.Definition.Property.String;
            type Number = core_client.types.Book.Definition.Property.Number;
            type Enum = core_client.types.Book.Definition.Property.Enum;
            type Set = core_client.types.Book.Definition.Property.Set;
            type DayTime = core_client.types.Book.Definition.Property.DayTime;
            type Email = core_client.types.Book.Definition.Property.Email;
            type Integer = core_client.types.Book.Definition.Property.Integer;
            type Float = core_client.types.Book.Definition.Property.Float;
            type Binary = core_client.types.Book.Definition.Property.Binary;
            type Encrypted = core_client.types.Book.Definition.Property.Encrypted;
            type Day = core_client.types.Book.Definition.Property.Day;
            type Time = core_client.types.Book.Definition.Property.Time;
            type EnumString = core_client.types.Book.Definition.Property.EnumString;
            type EnumNumber = core_client.types.Book.Definition.Property.EnumNumber;
            type SetString = core_client.types.Book.Definition.Property.SetNumber;
            type SetNumber = core_client.types.Book.Definition.Property.SetString;
            type Atom = core_client.types.Book.Definition.Property.Atom;
            type AtomArray = core_client.types.Book.Definition.Property.AtomArray;
            namespace Format {
                type Float = core_client.types.Book.Definition.Property.Format.Float;
            }
            namespace Validation {
                type String = core_client.types.Book.Definition.Property.Validation.String;
                type Number = core_client.types.Book.Definition.Property.Validation.Number;
                type DayTime = core_client.types.Book.Definition.Property.Validation.DayTime;
                type SetString = core_client.types.Book.Definition.Property.Validation.SetString;
                type SetNumber = core_client.types.Book.Definition.Property.Validation.SetNumber;
                type Atom = core_client.types.Book.Definition.Property.Validation.Atom;
            }
        }
    }
}
