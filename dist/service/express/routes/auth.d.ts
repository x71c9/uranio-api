/**
 * Express Authentication route module
 *
 * @packageDocumentation
 */
import express from 'express';
import { schema } from '../../../sch/index';
export declare function create_express_auth_route<A extends schema.AuthName>(atom_name: A): express.Router;
