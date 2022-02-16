/**
 * Express default route module
 *
 * @packageDocumentation
 */
import express from 'express';
import { schema } from '../../../sch/index';
export declare function create_express_route<A extends schema.AtomName>(atom_name: A): express.Router;
