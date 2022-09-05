/**
 * Express common route module
 *
 * @packageDocumentation
 */
import express from 'express';
import { urn_response } from 'uranio-utils';
import * as types from '../../../srv/types';
import { schema } from '../../../sch/server';
export declare function express_request_to_partial_api_request<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth>(req: express.Request): Partial<types.Api.Request<A, R, D>>;
export declare function return_uranio_response_to_express(urn_res: urn_response.General<any, any>, res: express.Response): express.Response;
