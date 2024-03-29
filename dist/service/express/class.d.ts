/**
 * Express class module
 *
 * @packageDocumentation
 */
import express from 'express';
import { Service } from '../types';
declare type Callback = () => void;
declare class ExpressWebService implements Service {
    service_name: string;
    express_app: express.Application;
    private server?;
    constructor(service_name?: string);
    listen(portcall?: Callback): void;
    listen(portcall?: number, callback?: Callback): void;
    close(): void;
}
export declare function create(): ExpressWebService;
export {};
