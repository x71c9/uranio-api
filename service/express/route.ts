/**
 * Express default route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init(`EXPRESS_ROUTE`, `Express default route`);

import urn_core from 'urn_core';

import {AtomName, Query} from '../../types';

import {ExpressQueryParam} from './types';

export function create(atom_name:AtomName):express.Router{
	
	urn_log.fn_debug(`Create Express Router`);
	
	const router = express.Router();
	
	router.get('/', async (req, res) => {
		
		const urn_bll = urn_core.bll.create_basic(atom_name);
		
		const filter = _process_request_filter(req.query.filter);
		const options = _process_request_options(req.query.options);
		
		const res_find = await urn_bll.find(filter, options);
		res.status(200).send(res_find);
		
	});
	
	router.get('/:id', async (req, res) => {
		
		const urn_bll = urn_core.bll.create_basic(atom_name);
		
		const options = _process_request_options(req.query.depth);
		
		const res_find = await urn_bll.find_by_id(req.params.id, options);
		
		res.status(200).send(res_find);
		
	});
	
	router.post('/', async (req, res) => {
		
		const urn_bll = urn_core.bll.create_basic(atom_name);
		
		const res_find = await urn_bll.insert_new(req.body);
		
		res.status(200).send(res_find);
		
	});
	
	router.post('/:id', async (req, res) => {
		
		const urn_bll = urn_core.bll.create_basic(atom_name);
		
		const res_find = await urn_bll.update_by_id(req.params.id, req.body);
		
		res.status(200).send(res_find);
		
	});
	
	router.delete('/:id', async (req, res) => {
		
		const urn_bll = urn_core.bll.create_basic(atom_name);
		
		const res_find = await urn_bll.remove_by_id(req.params.id);
		
		res.status(200).send(res_find);
		
	});
	
	return router;
	
}

function _process_request_filter<A extends AtomName>(filter:ExpressQueryParam)
		:Query<A>{
	if(typeof filter === 'undefined'){
		return {};
	}
	if(!Array.isArray(filter) && typeof filter === 'object'){
		return filter;
	}
	throw urn_exc.create(`INVALID_FILTER`, `Invalid filter`);
}

function _process_request_options<A extends AtomName>(options:ExpressQueryParam)
		:Query.Options<A>{
	if(typeof options === 'undefined'){
		return {};
	}
	if(!Array.isArray(options) && typeof options === 'object'){
		return options;
	}
	throw urn_exc.create(`INVALID_OPTIONS`, `Invalid options`);
}

