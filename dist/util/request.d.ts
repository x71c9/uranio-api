/**
 * Module for handling request path
 *
 * @packageDocumentation
 */
import { urn_response, urn_exception } from 'urn-lib';
import core from 'uranio-core';
import { schema } from '../sch/server';
import * as types from '../srv/types';
export declare function process_request_path(full_path: string): types.Api.Request.Paths;
export declare function get_auth_action<A extends schema.AtomName>(atom_name: A, route_name: keyof types.Book.Definition.Dock.Routes<A>): core.types.AuthAction;
export declare function get_atom_name_from_atom_path(atom_path: string): schema.AtomName | undefined;
export declare function get_route_name<A extends schema.AtomName, R extends schema.RouteName<A>>(atom_name: A, route_path: string, http_method: types.RouteMethod): R | undefined;
export declare function is_auth_request(atom_name: schema.AtomName, atom_path: string): boolean;
export declare function get_params_from_route_path<A extends schema.AtomName, R extends schema.RouteName<A>>(atom_name: A, route_name: R, route_path: string): types.Api.Request.Params<A, R>;
export declare function store_error(urn_res: urn_response.Fail, atom_request: Partial<schema.Atom<'_request'>>, ex?: urn_exception.ExceptionInstance): void;
export declare function api_handle_exception<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth>(ex: urn_exception.ExceptionInstance, partial_api_request: Partial<types.Api.Request<A, R, D>>): urn_response.Fail<any>;
export declare function api_handle_and_store_exception<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth>(ex: urn_exception.ExceptionInstance, partial_api_request: Partial<types.Api.Request<A, R, D>>): urn_response.Fail<any>;
export declare function partial_api_request_to_atom_request<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth>(partial_api_request: Partial<types.Api.Request<A, R, D>>): schema.AtomShape<'_request'>;
export declare function validate_request<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth>(api_request: Partial<types.Api.Request<A, R, D>>): types.Api.Request<A, R, D>;
