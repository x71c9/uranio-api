/**
 * Lambda types module
 *
 * @packageDocumentation
 */
import * as types from '../types';
export declare type LambdaName = 'netlify';
export interface Lambda {
    handle: (event: LambdaEvent, context: LambdaContext) => Promise<HandlerResponse>;
}
export interface LambdaEvent {
    rawURL: string;
    rawQuery: string;
    path: string;
    httpMethod: types.RouteMethod;
    headers: EventHeaders;
    multiValueHeaders: EventMultiValueHeaders;
    queryStringParameters: EventQueryStringParameters | null;
    multiValueQueryStringParametes: EventMultiValueQueryStringParameters | null;
    body: string | null;
    isBase64Encoded: boolean;
}
export interface LambdaContext {
    callbackWaitsForEmptyEventLoop: boolean;
    functionName: string;
    functionVersion: string;
    invokedFunctionArn: string;
    memoryLimitInMB: string;
    awsRequestId: string;
    logGroupName: string;
    logStreamName: string;
    identity?: {
        [key: string]: any;
    };
    clientContext?: {
        [key: string]: any;
    };
    getRemainingTimeInMillis(): number;
}
export interface HandlerResponse {
    statusCode: number;
    headers?: LambdaHeaders;
    multiValueHeaders?: LambdaMultiValueHeaders;
    body?: any;
    isBase64Encoded?: boolean;
}
interface EventHeaders {
    [name: string]: string | undefined;
}
interface EventMultiValueHeaders {
    [name: string]: string[] | undefined;
}
interface EventQueryStringParameters {
    [name: string]: string | undefined;
}
interface EventMultiValueQueryStringParameters {
    [name: string]: string[] | undefined;
}
export interface LambdaHeaders {
    [header: string]: boolean | number | string;
}
export interface LambdaMultiValueHeaders {
    [header: string]: ReadonlyArray<boolean | number | string>;
}
export interface HandlerCallback {
    (error: any, response: Response): void;
}
export interface Handler {
    (event: LambdaEvent, context: LambdaContext, callback: HandlerCallback): void | Response | Promise<Response>;
}
export {};
