/**
 * Express users route module
 *
 * @packageDocumentation
 */

import express from 'express';

import urn_core from 'urn-core';

const users_route = express.Router();

const urn_bll_users = urn_core.users.create();

users_route.get('/', async (req, res) => {
	
	const res_bll = await urn_bll_users.find({});
	
	console.log(req);
	
	res.status(200).send(res_bll);
	
});

export {users_route};
