/**
 * Netlify class module
 *
 * @packageDocumentation
 */
import { urn_response } from 'uranio-utils';
import * as types from '../../srv/types';
import { schema } from '../../sch/server';
import { Lambda, LambdaEvent, LambdaContext, HandlerResponse } from '../types';
declare class NetlifyLambda implements Lambda {
    handle(event: LambdaEvent, context: LambdaContext): Promise<HandlerResponse>;
    lambda_route<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth>(api_request: types.Api.Request<A, R, D>): Promise<urn_response.General<any, any, any>>;
}
export declare function create(): NetlifyLambda;
export {};
