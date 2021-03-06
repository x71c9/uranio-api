/**
 * Module for Server Atom Book Methods
 *
 * @packageDocumentation
 */
import { Book as ClientBook } from '../typ/book_cln';
import { Book } from '../typ/book';
import { schema } from '../sch/server';
export declare function get_dock_url<A extends schema.AtomName>(atom_name: A): string;
export declare function get_route_definition<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth>(atom_name: A, route_name: R): Book.Definition.Dock.Routes.Route<A, R, D>;
export declare function get_routes_definition<A extends schema.AtomName>(atom_name: A): Book.Definition.Dock.Routes<A>;
export declare function get_dock_definition<A extends schema.AtomName>(atom_name: A): Book.Definition.Dock<A>;
export declare function add_route_definition<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth = 0>(atom_name: A, route_name: R, route_definition: Book.Definition.Dock.Routes.Route<A, R, D>): Book.Definition.Dock.Routes<A>;
export declare function add_definition<A extends schema.AtomName>(atom_name: A, atom_definition: ClientBook.Definition): Book;
export declare function get_names(): schema.AtomName[];
export declare function validate_name(atom_name: string): boolean;
export declare function validate_auth_name(atom_name: string): boolean;
export declare function get_plural(atom_name: schema.AtomName): string;
export declare function get_all_definitions(): Book;
export declare function get_definition<A extends schema.AtomName>(atom_name: A): Book.Definition<A>;
export declare function get_property_definition<A extends schema.AtomName>(atom_name: A, property_name: keyof Book.Definition.Properties): Book.Definition.Property;
export declare function get_custom_properties_definition<A extends schema.AtomName>(atom_name: A): Book.Definition.Properties;
export declare function get_properties_definition<A extends schema.AtomName>(atom_name: A): Book.Definition.Properties;
export declare function has_property<A extends schema.AtomName>(atom_name: A, key: string): boolean;
