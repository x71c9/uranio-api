/**
 * Express module
 *
 * @packageDocumentation
 */

import express from 'express';

import cors from 'cors';

import {Service} from '../types';

import {users_route} from './users';

const express_app = express();

express_app.use(cors());

express_app.use(express.json());

express_app.use(express.urlencoded({extended: true}));

export class ExpressWebService implements Service {
	
	constructor(){
		express_app.use('/users', users_route);
	}
	
	public listen(ws_port:number, callback:() => void):void{
		express_app.listen(ws_port, callback);
	}
}

