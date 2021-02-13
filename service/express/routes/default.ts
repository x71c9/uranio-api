/**
 * Express default route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_log, urn_return} from 'urn-lib';

const urn_ret = urn_return.create();

import urn_core from 'urn_core';

import {AtomName} from '../../../types';

import {log_and_catch_middleware} from '../mdlw';

import * as req_validator from './validate';

export function create(atom_name:AtomName):express.Router{
	
	urn_log.fn_debug(`Create Express Default Atom Router`);
	
	const router = express.Router();
	
	router.get('/', log_and_catch_middleware(async (req, res) => {
		
		req_validator.only_valid_query_keys(req.query, ['filter','options']);
		req_validator.empty(req.params, 'params');
		req_validator.empty(req.body, 'body');
		
		const filter = req_validator.process_request_filter(req.query.filter);
		const options = req_validator.process_request_options(req.query.options);
		
		const urn_bll = urn_core.bll.create_basic(atom_name);
		
		const res_find = await urn_bll.find(filter, options);
		const urn_response = urn_ret.return_success('Success', res_find);
		
		return res.status(200).json(urn_response);
		
	}));
	
	router.get('/:id', log_and_catch_middleware(async (req, res) => {
		
		req_validator.only_valid_param_keys(req.param, ['id']);
		req_validator.only_valid_query_keys(req.query, ['filter','options']);
		req_validator.empty(req.body, 'body');
		
		const options = req_validator.process_request_options(req.query.options);
		
		const urn_bll = urn_core.bll.create_basic(atom_name);
		
		const res_find = await urn_bll.find_by_id(req.params.id, options);
		const urn_response = urn_ret.return_success('Success', res_find);
		
		res.status(200).json(urn_response);
		
	}));
	
	router.post('/', log_and_catch_middleware(async (req, res) => {
		
		req_validator.empty(req.params, 'params');
		req_validator.empty(req.query, 'query');
		
		const urn_bll = urn_core.bll.create_basic(atom_name);
		
		const res_find = await urn_bll.insert_new(req.body);
		const urn_response = urn_ret.return_success('Success', res_find);
		
		res.status(200).json(urn_response);
		
	}));
	
	router.post('/:id', log_and_catch_middleware(async (req, res) => {
		
		req_validator.only_valid_param_keys(req.param, ['id']);
		req_validator.empty(req.query, 'query');
		
		const urn_bll = urn_core.bll.create_basic(atom_name);
		
		const res_find = await urn_bll.update_by_id(req.params.id, req.body);
		const urn_response = urn_ret.return_success('Success', res_find);
		
		res.status(200).json(urn_response);
		
	}));
	
	router.delete('/:id', log_and_catch_middleware(async (req, res) => {
		
		req_validator.only_valid_param_keys(req.param, ['id']);
		req_validator.empty(req.query, 'query');
		req_validator.empty(req.body, 'body');
		
		const urn_bll = urn_core.bll.create_basic(atom_name);
		
		const res_find = await urn_bll.remove_by_id(req.params.id);
		const urn_response = urn_ret.return_success('Success', res_find);
		
		res.status(200).json(urn_response);
		
	}));
	
	return router;
	
}




