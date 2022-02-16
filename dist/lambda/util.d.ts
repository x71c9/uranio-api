/**
 * Lambda util module
 *
 * @packageDocumentation
 */
import lmpp from 'lambda-multipart-parser';
import { LambdaEvent } from './types';
declare type QueryParamsObject = {
    [k: string]: any;
};
export declare function map_lambda_query_params(json: QueryParamsObject): QueryParamsObject;
export declare function lambra_multipart_parse(event: LambdaEvent): Promise<lmpp.MultipartRequest>;
export {};
/**
 * Multipart parser
 *
 * Must be reviewed and imporved.
 */
