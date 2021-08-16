/**
 * Server part of routes module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import urn_core from 'uranio-core';

import * as types from '../types';

import {
	AtomName,
	Book
} from '../types';

import {default_routes} from './client';

import {
	route_def as common_route_def,
	atom_api_with_defaults as common_atom_api_with_defaults
} from './routes';

export function route_def(atom_name:types.AtomName, route_name:string)
		:types.Book.Definition.Api.Routes.Route{
	const default_routes = return_default_routes(atom_name);
	return common_route_def(default_routes, atom_name, route_name);
}

export function atom_api_with_defaults(
	default_routes:types.Book.Definition.Api.Routes,
	atom_name:types.AtomName
):types.Book.Definition.Api{
	return common_atom_api_with_defaults(default_routes, atom_name);
}

export function return_default_routes(atom_name:AtomName)
		:Book.Definition.Api.Routes{
	
	(default_routes.find as Book.Definition.Api.Routes.Route).call = async (api_request:types.Api.Request) => {
		urn_log.fn_debug(`Router Call GET [find] / [${atom_name}]`);
		const urn_bll = urn_core.bll.create(
			atom_name,
			api_request.passport
		) as urn_core.bll.BLL<typeof atom_name>;
		const bll_res = await urn_bll.find(
			api_request.query.filter,
			api_request.query.options
		);
		return bll_res;
	};
	
	(default_routes.find_id as Book.Definition.Api.Routes.Route).call = async (api_request:types.Api.Request) => {
		urn_log.fn_debug(`Router Call GET [find_id] /:id [${atom_name}]`);
		const urn_bll = urn_core.bll.create(
			atom_name,
			api_request.passport
		) as urn_core.bll.BLL<typeof atom_name>;
		const bll_res = await urn_bll.find_by_id(
			api_request.params.id!,
			api_request.query.options
		);
		return bll_res;
	};
	
	(default_routes.find_one as Book.Definition.Api.Routes.Route).call = async (api_request:types.Api.Request) => {
		urn_log.fn_debug(`Router Call GET [find_one] / [${atom_name}]`);
		const urn_bll = urn_core.bll.create(
			atom_name,
			api_request.passport
		) as urn_core.bll.BLL<typeof atom_name>;
		const bll_res = await urn_bll.find_one(
			api_request.query.filter,
			api_request.query.options
		);
		return bll_res;
	};
	
	(default_routes.insert as Book.Definition.Api.Routes.Route).call = async (api_request:types.Api.Request) => {
		urn_log.fn_debug(`Router Call POST [insert] / [${atom_name}]`);
		const urn_bll = urn_core.bll.create(
			atom_name,
			api_request.passport
		) as urn_core.bll.BLL<typeof atom_name>;
		const bll_res = await urn_bll.insert_new(api_request.body);
		return bll_res;
	};
	
	(default_routes.update as Book.Definition.Api.Routes.Route).call = async (api_request:types.Api.Request) => {
		urn_log.fn_debug(`Router Call POST [update] / [${atom_name}]`);
		const urn_bll = urn_core.bll.create(
			atom_name,
			api_request.passport
		) as urn_core.bll.BLL<typeof atom_name>;
		const bll_res = await urn_bll.update_by_id(
			api_request.params.id!,
			api_request.body
		);
		return bll_res;
	};
	
	(default_routes.delete as Book.Definition.Api.Routes.Route).call = async (api_request:types.Api.Request) => {
		urn_log.fn_debug(`Router Call DELETE [delete] / [${atom_name}]`);
		const urn_bll = urn_core.bll.create(
			atom_name,
			api_request.passport
		) as urn_core.bll.BLL<typeof atom_name>;
		const bll_res = await urn_bll.remove_by_id(api_request.params.id!);
		return bll_res;
	};
	
	return default_routes as unknown as Book.Definition.Api.Routes;
	
	// return {
	//   find: {
	//     method: types.RouteMethod.GET,
	//     action: types.AuthAction.READ,
	//     url: '/',
	//     query: ['filter', 'options'],
	//     call: async (api_request:types.Api.Request) => {
	//       urn_log.fn_debug(`Router Call GET [find] / [${atom_name}]`);
	//       const urn_bll = urn_core.bll.create(
	//         atom_name,
	//         api_request.passport
	//       ) as urn_core.bll.BLL<typeof atom_name>;
	//       const bll_res = await urn_bll.find(
	//         api_request.query.filter,
	//         api_request.query.options
	//       );
	//       return bll_res;
	//     }
	//   },
	//   find_id: {
	//     method: types.RouteMethod.GET,
	//     action: types.AuthAction.READ,
	//     url: '/:id',
	//     query: ['options'],
	//     call: async (api_request:types.Api.Request) => {
	//       urn_log.fn_debug(`Router Call GET [find_id] /:id [${atom_name}]`);
	//       const urn_bll = urn_core.bll.create(
	//         atom_name,
	//         api_request.passport
	//       ) as urn_core.bll.BLL<typeof atom_name>;
	//       const bll_res = await urn_bll.find_by_id(
	//         api_request.params.id!,
	//         api_request.query.options
	//       );
	//       return bll_res;
	//     }
	//   },
	//   find_one: {
	//     method: types.RouteMethod.GET,
	//     action: types.AuthAction.READ,
	//     url: '/',
	//     query: ['filter', 'options'],
	//     call: async (api_request:types.Api.Request) => {
	//       urn_log.fn_debug(`Router Call GET [find_one] / [${atom_name}]`);
	//       const urn_bll = urn_core.bll.create(
	//         atom_name,
	//         api_request.passport
	//       ) as urn_core.bll.BLL<typeof atom_name>;
	//       const bll_res = await urn_bll.find_one(
	//         api_request.query.filter,
	//         api_request.query.options
	//       );
	//       return bll_res;
	//     }
	//   },
	//   insert: {
	//     method: types.RouteMethod.POST,
	//     action: types.AuthAction.WRITE,
	//     url: '/',
	//     call: async (api_request:types.Api.Request) => {
	//       urn_log.fn_debug(`Router Call POST [insert] / [${atom_name}]`);
	//       const urn_bll = urn_core.bll.create(
	//         atom_name,
	//         api_request.passport
	//       ) as urn_core.bll.BLL<typeof atom_name>;
	//       const bll_res = await urn_bll.insert_new(api_request.body);
	//       return bll_res;
	//     }
	//   },
	//   update: {
	//     method: types.RouteMethod.POST,
	//     action: types.AuthAction.WRITE,
	//     url: '/:id',
	//     call: async (api_request:types.Api.Request) => {
	//       urn_log.fn_debug(`Router Call POST [update] / [${atom_name}]`);
	//       const urn_bll = urn_core.bll.create(
	//         atom_name,
	//         api_request.passport
	//       ) as urn_core.bll.BLL<typeof atom_name>;
	//       const bll_res = await urn_bll.update_by_id(
	//         api_request.params.id!,
	//         api_request.body
	//       );
	//       return bll_res;
	//     }
	//   },
	//   delete: {
	//     method: types.RouteMethod.DELETE,
	//     action: types.AuthAction.WRITE,
	//     url: '/:id',
	//     call: async (api_request:types.Api.Request) => {
	//       urn_log.fn_debug(`Router Call DELETE [delete] / [${atom_name}]`);
	//       const urn_bll = urn_core.bll.create(
	//         atom_name,
	//         api_request.passport
	//       ) as urn_core.bll.BLL<typeof atom_name>;
	//       const bll_res = await urn_bll.remove_by_id(api_request.params.id!);
	//       return bll_res;
	//     }
	//   }
	// };
	
}

// export function return_auth_route(atom_name:AuthName)
//     :Book.Definition.Api.Routes{
//   const auth_bll = urn_core.bll.auth.create(atom_name);
//   return {
//     auth: {
//       method: types.RouteMethod.POST,
//       action: types.AuthAction.READ,
//       url: '',
//       call: async (api_request:types.Api.Request) => {
//         const token = await auth_bll.authenticate(
//           api_request.body.email,
//           api_request.body.password
//         );
//         return token;
//         // return res.header('x-auth-token', token).status(200).send({});
//       }
//     }
//   };
// }
