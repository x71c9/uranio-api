/**
 * Express Authentication route module
 *
 * @packageDocumentation
 */

import express from 'express';

import {urn_log} from 'urn-lib';

import urn_core from '../../../core';

import {AuthName, RouteRequest} from '../../../types';

import {auth_route_middlewares} from '../mdlw';

export function create_auth_route<A extends AuthName>(atom_name:A)
		:express.Router{
	
	urn_log.fn_debug(`Create Express Auth Atom Router [${atom_name}]`);
	
	const router = express.Router();
	
	const auth_bll = urn_core.bll.auth.create(atom_name);
	
	router.post('/', auth_route_middlewares(atom_name, 'auth',
		async (route_request:RouteRequest) => {
			const token = await auth_bll.authenticate(
				route_request.body.email,
				route_request.body.password
			);
			return token;
		}
	));
	
	return router;
	
}

// export function create_auth_route<A extends AuthName>(atom_name:A)
//     :express.Router{
	
//   const router = express.Router();
	
//   const auth_bll = urn_core.bll.auth.create(atom_name);
	
//   router.post('/', auth_route_middlewares(atom_name, 'auth', AuthAction.AUTH, async (req:express.Request, res:express.Response) => {
		
//     req_validator.empty(req.params, 'params');
//     req_validator.empty(req.query, 'query');
		
//     try {
			
//       const token = await auth_bll.authenticate(req.body.email, req.body.password);
//       return res.header('x-auth-token', token).status(200).send({});
			
//     }catch(ex){
			
//       switch(ex.type){
//         case urn_exception.ExceptionType.NOT_FOUND:{
//           const urn_res = urn_ret.return_error(
//             404,
//             `Not found`,
//             `${atom_name.toUpperCase()}_NOT_FOUND`,
//             `[${atom_name}] not found.`
//           );
//           await store_error(urn_res, res);
//           return res.status(404).send(urn_res);
//         }
//         case urn_exception.ExceptionType.INVALID_REQUEST:{
//           if(ex.error_code === 'AUTH_INVALID_PASSWORD'){
//             const urn_res = urn_ret.return_error(
//               400,
//               `Invalid request`,
//               `AUTH_INVALID_PASSWORD`,
//               `Invalid password.`
//             );
//             await store_error(urn_res, res);
//             return res.status(400).send(urn_res);
//           }else{
//             throw ex;
//           }
//         }
//       }
//       throw ex;
			
//     }
		
//   }));

//   return router;
// }


// export {
//   router as auth_route,
//   super_router as superauth_route
// };
