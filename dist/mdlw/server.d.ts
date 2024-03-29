/**
 * Route middleware module
 *
 * @packageDocumentation
 */
import { urn_response } from 'uranio-utils';
import * as types from '../srv/types';
import { schema } from '../sch/server';
export declare function route_middleware<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth = 0>(api_request: types.Api.Request<A, R, D>): Promise<urn_response.General<any, any>>;
export declare function auth_route_middleware<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth = 0>(api_request: types.Api.Request<A, R, D>, auth_handler: types.AuthHandler<A, R, D>): Promise<urn_response.General<any, any>>;
