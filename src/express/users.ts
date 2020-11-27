/**
 * Express users route module
 *
 * @packageDocumentation
 */

import express from 'express';

import urn_core from 'urn-core';

const users_route = express.Router();

const urn_bll_users = urn_core.users.create();

users_route.get('/', async (_, res) => {
	
	const res_bll = await urn_bll_users.find({});
	
	res.status(200).send(res_bll);
	
});

users_route.post('/', async (req, res) => {
	
	console.log(req.body);
	
	const user = urn_core.atoms.user.create(req.body);
	
	const res_bll = await urn_bll_users.insert_one(user);
	
	res.status(200).send(res_bll);
	
});

export {users_route};
