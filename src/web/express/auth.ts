/**
 * Express users route module
 *
 * @packageDocumentation
 */

import express from 'express';

import urn_core from 'urn-core';

const auth_route = express.Router();

const urn_bll_users = urn_core.users.create();

auth_route.post('/', async (req, res) => {
	
	const res_bll = await urn_bll_users.authenticate(req.body);
	
	res.status(200).send(res_bll);
	
});

export {auth_route};
