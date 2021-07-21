/**
 * Express common route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_response} from 'urn-lib';

import * as types from '../../../types';

export function express_request_to_raw_request(req:express.Request)
		:types.RawRequest{
	
	const raw_request:types.RawRequest = {
		path: req.path,
		params: req.params,
		query: req.query,
	};
	if(req.body){
		raw_request.body = req.body;
	}
	if(req.ip){
		raw_request.ip = req.ip;
	}
	return raw_request;
	
}

function _set_and_remove_headers(urn_res:urn_response.General<any,any>, res:express.Response)
		:express.Response{
	if(urn_res.payload && urn_res.payload.headers){
		const headers = urn_res.payload.headers;
		for(const [name, value] of Object.entries(headers)){
			res.setHeader(name, value as any);
		}
		delete urn_res.payload.headers;
	}
	return res;
}

export function return_uranio_response_to_express(urn_res:urn_response.General<any,any>, res:express.Response)
		:express.Response{
	res = _set_and_remove_headers(urn_res, res);
	return res.status(urn_res.status).send(urn_res);
}
