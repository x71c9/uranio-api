/**
 * Default routes modules
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import urn_core from 'uranio-core';

import * as book_types from '../types';

import {
	AtomName,
	Book
} from '../types';

export function return_default_routes(atom_name:AtomName)
		:Book.Definition.Api.Routes{
	return {
		find: {
			method: book_types.RouteMethod.GET,
			action: book_types.AuthAction.READ,
			url: '/',
			query: ['filter', 'options'],
			call: async (api_request:book_types.ApiRequest) => {
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
			}
		},
		find_id: {
			method: book_types.RouteMethod.GET,
			action: book_types.AuthAction.READ,
			url: '/:id',
			query: ['options'],
			call: async (api_request:book_types.ApiRequest) => {
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
			}
		},
		find_one: {
			method: book_types.RouteMethod.GET,
			action: book_types.AuthAction.READ,
			url: '/',
			query: ['filter', 'options'],
			call: async (api_request:book_types.ApiRequest) => {
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
			}
		},
		insert: {
			method: book_types.RouteMethod.POST,
			action: book_types.AuthAction.WRITE,
			url: '/',
			call: async (api_request:book_types.ApiRequest) => {
				urn_log.fn_debug(`Router Call POST [insert] / [${atom_name}]`);
				const urn_bll = urn_core.bll.create(
					atom_name,
					api_request.passport
				) as urn_core.bll.BLL<typeof atom_name>;
				const bll_res = await urn_bll.insert_new(api_request.body);
				return bll_res;
			}
		},
		update: {
			method: book_types.RouteMethod.POST,
			action: book_types.AuthAction.WRITE,
			url: '/:id',
			call: async (api_request:book_types.ApiRequest) => {
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
			}
		},
		delete: {
			method: book_types.RouteMethod.DELETE,
			action: book_types.AuthAction.WRITE,
			url: '/:id',
			call: async (api_request:book_types.ApiRequest) => {
				urn_log.fn_debug(`Router Call DELETE [delete] / [${atom_name}]`);
				const urn_bll = urn_core.bll.create(
					atom_name,
					api_request.passport
				) as urn_core.bll.BLL<typeof atom_name>;
				const bll_res = await urn_bll.remove_by_id(api_request.params.id!);
				return bll_res;
			}
		}
	};
}

// export function return_auth_route(atom_name:AuthName)
//     :Book.Definition.Api.Routes{
//   const auth_bll = urn_core.bll.auth.create(atom_name);
//   return {
//     auth: {
//       method: book_types.RouteMethod.POST,
//       action: book_types.AuthAction.READ,
//       url: '',
//       call: async (api_request:book_types.ApiRequest) => {
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

