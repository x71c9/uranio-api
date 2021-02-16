/**
 * Express default route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_log, urn_return} from 'urn-lib';

const urn_ret = urn_return.create();

import urn_core from 'urn_core';

import {AtomName, AuthAction} from '../../../types';

import {route_middlewares} from '../mdlw';

import * as req_validator from './validate';

export function create_route(atom_name:AtomName)
		:express.Router{
	
	urn_log.fn_debug(`Create Express Default Atom Router`);
	
	const router = express.Router();
	
	router.get('/', route_middlewares(atom_name, AuthAction.READ, async (req, res) => {
		
		req_validator.only_valid_query_keys(req.query, ['filter','options']);
		req_validator.empty(req.params, 'params');
		req_validator.empty(req.body, 'body');
		
		const filter = req_validator.process_request_filter(req.query.filter);
		const options = req_validator.process_request_options(req.query.options);
		
		const urn_bll = urn_core.bll.create(atom_name, res.locals.urn.token_object);
		
		let bll_res = await urn_bll.find(filter, options);
		
		bll_res = urn_core.atm.util.hide_hidden_properties(atom_name, bll_res);
		
		const urn_response = urn_ret.return_success('Success', bll_res);
		
		return res.status(200).json(urn_response);
		
	}));
	
	router.get('/:id', route_middlewares(atom_name, AuthAction.READ, async (req, res) => {
		
		req_validator.only_valid_param_keys(req.param, ['id']);
		req_validator.only_valid_query_keys(req.query, ['filter','options']);
		req_validator.empty(req.body, 'body');
		
		const options = req_validator.process_request_options(req.query.options);

		console.log(res.locals.urn.token_object);
		
		const urn_bll = urn_core.bll.create(atom_name, res.locals.urn.token_object);
		
		let bll_res = await urn_bll.find_by_id(req.params.id, options);
		
		bll_res = urn_core.atm.util.hide_hidden_properties(atom_name, bll_res);
		
		const urn_response = urn_ret.return_success('Success', bll_res);
		
		res.status(200).json(urn_response);
		
	}));
	
	router.post('/', route_middlewares(atom_name, AuthAction.WRITE, async (req, res) => {
		
		req_validator.empty(req.params, 'params');
		req_validator.empty(req.query, 'query');
		
		const urn_bll = urn_core.bll.create(atom_name, res.locals.urn.token_object);
		
		let bll_res = await urn_bll.insert_new(req.body);
		
		bll_res = urn_core.atm.util.hide_hidden_properties(atom_name, bll_res);
		
		const urn_response = urn_ret.return_success('Success', bll_res);
		
		res.status(200).json(urn_response);
		
	}));
	
	router.post('/:id', route_middlewares(atom_name, AuthAction.WRITE, async (req, res) => {
		
		req_validator.only_valid_param_keys(req.param, ['id']);
		req_validator.empty(req.query, 'query');
		
		const urn_bll = urn_core.bll.create(atom_name, res.locals.urn.token_object);
		
		let bll_res = await urn_bll.update_by_id(req.params.id, req.body);
		
		bll_res = urn_core.atm.util.hide_hidden_properties(atom_name, bll_res);
		
		const urn_response = urn_ret.return_success('Success', bll_res);
		
		res.status(200).json(urn_response);
		
	}));
	
	router.delete('/:id', route_middlewares(atom_name, AuthAction.WRITE, async (req, res) => {
		
		req_validator.only_valid_param_keys(req.param, ['id']);
		req_validator.empty(req.query, 'query');
		req_validator.empty(req.body, 'body');
		
		const urn_bll = urn_core.bll.create(atom_name, res.locals.urn.token_object);
		
		let bll_res = await urn_bll.remove_by_id(req.params.id);
		
		console.log(bll_res);
		
		bll_res = urn_core.atm.util.hide_hidden_properties(atom_name, bll_res);
		
		const urn_response = urn_ret.return_success('Success', bll_res);
		
		res.status(200).json(urn_response);
		
	}));
	
	return router;
	
}

