/**
 * Server part of routes module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import urn_core from 'uranio-core';

import * as types from '../types';

import {default_routes} from './client';

import {
	route_def as common_route_def,
	atom_dock_with_defaults as common_atom_dock_with_defaults
} from './routes';

export function route_def<A extends types.AtomName, R extends types.RouteName<A>>(atom_name:A, route_name:R)
		:types.Book.Definition.Dock.Routes.Route<A,R>{
	const default_routes = return_default_routes(atom_name);
	return common_route_def(default_routes, atom_name, route_name);
}

export function atom_dock_with_defaults(
	default_routes:types.Book.Definition.Dock.Routes,
	atom_name:types.AtomName
):types.Book.Definition.Dock{
	return common_atom_dock_with_defaults(default_routes, atom_name);
}

export function return_default_routes(atom_name:types.AtomName)
		:types.Book.Definition.Dock.Routes{
	
	(default_routes.count as unknown as types.Book.Definition.Dock.Routes.Route<typeof atom_name,'count'>).call =
		async (api_request:types.Api.Request<typeof atom_name,'count'>) => {
			urn_log.fn_debug(`Router Call GET [count] / [${atom_name}]`);
			const urn_bll = urn_core.bll.create(atom_name, api_request.passport) as
				urn_core.bll.BLL<typeof atom_name>;
			const filter = (api_request.query as types.Api.Request.Query<'superuser', 'count'>).filter || {};
			const bll_res = await urn_bll.count(filter);
			return bll_res;
		};
	
	(default_routes.find_one as unknown as types.Book.Definition.Dock.Routes.Route<typeof atom_name, 'find_one'>).call =
		async (api_request:types.Api.Request<typeof atom_name, 'find_one'>) => {
			urn_log.fn_debug(`Router Call GET [find_one] / [${atom_name}]`);
			const urn_bll = urn_core.bll.create(atom_name, api_request.passport) as
				urn_core.bll.BLL<typeof atom_name>;
			const filter = (api_request.query as types.Api.Request.Query<'superuser', 'find'>).filter || {};
			const options = (api_request.query as types.Api.Request.Query<'superuser', 'find'>).options;
			const bll_res = await urn_bll.find_one(filter, options);
			return bll_res;
		};
	
	(default_routes.find as unknown as types.Book.Definition.Dock.Routes.Route<typeof atom_name,'find'>).call =
		async (api_request:types.Api.Request<typeof atom_name,'find'>) => {
			urn_log.fn_debug(`Router Call GET [find] / [${atom_name}]`);
			const urn_bll = urn_core.bll.create(atom_name, api_request.passport) as
				urn_core.bll.BLL<typeof atom_name>;
			const filter = (api_request.query as types.Api.Request.Query<'superuser', 'find'>).filter || {};
			const options = (api_request.query as types.Api.Request.Query<'superuser', 'find'>).options;
			const bll_res = await urn_bll.find(filter, options);
			return bll_res;
		};
	
	(default_routes.find_id as unknown as types.Book.Definition.Dock.Routes.Route<typeof atom_name, 'find_id'>).call =
		async (api_request:types.Api.Request<typeof atom_name, 'find_id'>) => {
			urn_log.fn_debug(`Router Call GET [find_id] /:id [${atom_name}]`);
			const urn_bll = urn_core.bll.create(atom_name, api_request.passport) as
				urn_core.bll.BLL<typeof atom_name>;
			const bll_res = await urn_bll.find_by_id(
				(api_request.params as types.Api.Request.Params<'superuser', 'find_id'>).id!,
				(api_request.query as types.Api.Request.Query<'superuser', 'find_id'>).options
			);
			return bll_res;
		};
	
	(default_routes.insert as unknown as types.Book.Definition.Dock.Routes.Route<typeof atom_name, 'insert'>).call =
		async (api_request:types.Api.Request<typeof atom_name, 'insert'>) => {
			urn_log.fn_debug(`Router Call POST [insert] / [${atom_name}]`);
			const urn_bll = urn_core.bll.create(atom_name, api_request.passport) as
				urn_core.bll.BLL<typeof atom_name>;
			const bll_res = await urn_bll.insert_new(api_request.body);
			return bll_res;
		};
	
	(default_routes.update as unknown as types.Book.Definition.Dock.Routes.Route<typeof atom_name, 'update'>).call =
		async (api_request:types.Api.Request<typeof atom_name, 'update'>) => {
			urn_log.fn_debug(`Router Call POST [update] / [${atom_name}]`);
			const urn_bll = urn_core.bll.create(atom_name, api_request.passport) as
				urn_core.bll.BLL<typeof atom_name>;
			const bll_res = await urn_bll.update_by_id(
				(api_request.params as types.Api.Request.Params<'superuser', 'find_id'>).id!,
				api_request.body
			);
			return bll_res;
		};
	
	(default_routes.delete as unknown as types.Book.Definition.Dock.Routes.Route<typeof atom_name, 'delete'>).call =
		async (api_request:types.Api.Request<typeof atom_name, 'delete'>) => {
			urn_log.fn_debug(`Router Call DELETE [delete] / [${atom_name}]`);
			const urn_bll = urn_core.bll.create(atom_name, api_request.passport) as
				urn_core.bll.BLL<typeof atom_name>;
			const id = (api_request.params as types.Api.Request.Params<'superuser', 'find_id'>).id!;
			const bll_res = await urn_bll.remove_by_id(id);
			return bll_res;
		};
	
	return default_routes as unknown as types.Book.Definition.Dock.Routes;
	
	// return {
	//   find: {
	//     method: types.RouteMethod.GET,
	//     action: types.AuthAction.READ,
	//     url: '/',
	//     query: ['filter', 'options'],
	//     call: async (api_request:types.Dock.Request) => {
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
	//     call: async (api_request:types.Dock.Request) => {
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
	//     call: async (api_request:types.Dock.Request) => {
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
	//     call: async (api_request:types.Dock.Request) => {
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
	//     call: async (api_request:types.Dock.Request) => {
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
	//     call: async (api_request:types.Dock.Request) => {
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
//     :types.Book.Definition.Dock.Routes{
//   const auth_bll = urn_core.bll.auth.create(atom_name);
//   return {
//     auth: {
//       method: types.RouteMethod.POST,
//       action: types.AuthAction.READ,
//       url: '',
//       call: async (api_request:types.Dock.Request) => {
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
