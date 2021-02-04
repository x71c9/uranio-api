/**
 * Express class module
 *
 * @packageDocumentation
 */

import {atom_book} from 'urn_book';

import express from 'express';

import cors from 'cors';

import {urn_log} from 'urn-lib';

import urn_core from 'urn_core';

import {
	AtomName,
	Book
} from '../../types';

import {Service} from '../types';

const express_app = express();

express_app.use(cors());

express_app.use(express.json());

express_app.use(express.urlencoded({extended: true}));

@urn_log.decorators.debug_constructor
@urn_log.decorators.debug_methods
class ExpressWebService implements Service {
	
	constructor(){
		let atom_name:AtomName;
		for(atom_name in atom_book){
			const atom_def = atom_book[atom_name] as Book.Definition;
			const router = _create_atom_route(atom_name);
			express_app.use(atom_def.api.url, router);
		}
	}
	
	listen(ws_port: number, callback:() => void): void {
		express_app.listen(ws_port, callback);
	}
	
}

function _create_atom_route(atom_name:AtomName):express.Router{
	
	const router = express.Router();
	
	const urn_bll = urn_core.bll.create_basic(atom_name);
	
	router.get('/', async (_, res) => {
		const res_find = await urn_bll.find({});
		res.status(200).send(res_find);
	});
	
	return router;
	
}

export function create():ExpressWebService{
	urn_log.fn_debug(`Create ExpressWebService`);
	return new ExpressWebService();
}
