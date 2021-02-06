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
		
		_only_valid_query_keys(req.query, ['filter','options']);
		_empty(req.body, 'body');
		
		const urn_bll = urn_core.bll.create_basic(atom_name);
		
		const filter = _process_request_filter(req.query.filter);
		const options = _process_request_options(req.query.options);
		
		const res_find = await urn_bll.find(filter, options);
		res.status(200).send(res_find);
		
	});
	
	router.get('/:id', async (req, res) => {
		
		_only_valid_param_keys(req.param, ['id']);
		_only_valid_query_keys(req.query, ['filter','options']);
		_empty(req.body, 'body');
		
		const urn_bll = urn_core.bll.create_basic(atom_name);
		
		const options = _process_request_options(req.query.options);
		
		const res_find = await urn_bll.find_by_id(req.params.id, options);
		
		res.status(200).send(res_find);
		
	});
	
	router.post('/', async (req, res) => {
		
		_empty(req.params, 'params');
		_empty(req.query, 'query');
		
		const urn_bll = urn_core.bll.create_basic(atom_name);
		
		const res_find = await urn_bll.insert_new(req.body);
		
		res.status(200).send(res_find);
		
	});
	
	router.post('/:id', async (req, res) => {
		
		_only_valid_param_keys(req.param, ['id']);
		_empty(req.query, 'query');
		
		const urn_bll = urn_core.bll.create_basic(atom_name);
		
		const res_find = await urn_bll.update_by_id(req.params.id, req.body);
		
		res.status(200).send(res_find);
		
	});
	
	router.delete('/:id', async (req, res) => {
		
		_only_valid_param_keys(req.param, ['id']);
		_empty(req.query, 'query');
		_empty(req.body, 'body');
		
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

function _only_valid_query_keys(query:any, valid_query_keys:string[])
		:void{
	if(typeof query === 'object'){
		for(const [k] of Object.entries(query)){
			if(!valid_query_keys.includes(k)){
				const err_msg = `Invalid request query parameters [${k}]`;
				throw urn_exc.create(`INVALID_QUERY`, err_msg);
			}
		}
	}
}

function _only_valid_param_keys(params:any, valid_params_keys:string[])
		:void{
	if(typeof params === 'object'){
		for(const [k] of Object.entries(params)){
			if(!valid_params_keys.includes(k)){
				const err_msg = `Invalid parameters [${k}]`;
				throw urn_exc.create(`INVALID_PARAMETERS`, err_msg);
			}
		}
	}
}

function _empty(p:any, param_name:string)
		:true{
	if(!p){
		return true;
	}
	if(typeof p === 'object' && Object.keys(p).length === 0){
		return true;
	}
	const err_msg = `Invalid request ${param_name}. ${param_name[0].toUpperCase() + param_name.slice(1)} should be empty.`;
	throw urn_exc.create(`INVALID_BODY`, err_msg);
}



