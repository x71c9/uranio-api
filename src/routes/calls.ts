/**
 * Server part of routes module
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init(`API_ROUTE_SERVER`, `Api route server module`);

import core from 'uranio-core';

import * as types from '../server/types';

import {schema} from '../sch/server';

// import {Book as ClientBook} from '../typ/book_cln';

import {add_media_routes, default_routes as cln_default_routes} from './client';

// import {
//   route_def as common_route_def,
//   atom_dock_with_defaults as common_atom_dock_with_defaults
// } from './common';

// export function route_def<A extends schema.AtomName, R extends schema.RouteName<A>>(atom_name:A, route_name:R)
//     :types.Book.Definition.Dock.Routes.Route<A,R>{
//   const server_default_routes = return_default_routes(atom_name) as ClientBook.Definition.Dock.Routes;
//   return common_route_def(server_default_routes, atom_name, route_name);
// }

// export function atom_dock_with_defaults<A extends core.schema.AtomName>(
//   default_routes:ClientBook.Definition.Dock.Routes,
//   atom_name:A
// ):types.Book.Definition.Dock<A>{
//   return common_atom_dock_with_defaults(default_routes, atom_name) as types.Book.Definition.Dock<A>;
// }

export function return_default_routes<A extends core.schema.AtomName>(atom_name:A)
		:types.Book.Definition.Dock.Routes<A>{
	
	let default_routes = urn_util.json.clean_parse(urn_util.json.safe_stringify(cln_default_routes));
	
	if(atom_name === 'media'){
		
		default_routes = add_media_routes();
		
		((default_routes as any).upload as any).call =
			async <A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth=0>(api_request:types.Api.Request<A,R,D>) => {
				urn_log.fn_debug(`Router Call POST [upload] / [${atom_name}]`);
				if(!api_request.file){
					throw urn_exc.create_invalid_request(
						`INVALID_REQUEST_MISSING_FILE_PARAM`,
						`Missing file param in api_request on upload media route.`
					);
				}
				const urn_media_bll = core.bll.media.create(api_request.passport);
				const params = {
					override: false,
					content_type: api_request.file.mime_type,
					content_length: api_request.file.size
				};
				const atom_media = await urn_media_bll.insert_file(api_request.file.name, api_request.file.data, params);
				return atom_media;
			};
			
		((default_routes as any).presigned as any).call =
			async <A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth=0>(api_request:types.Api.Request<A,R,D>) => {
				urn_log.fn_debug(`Router Call GET [presigned] / [${atom_name}]`);
				if(!api_request.query){
					throw urn_exc.create_invalid_request(
						`INVALID_REQUEST_MISSING_QUERY`,
						`Missing query in api_request on presigned media route.`
					);
				}
				const urn_media_bll = core.bll.media.create(api_request.passport);
				const params = {
					content_type: (api_request.query as any).type,
					content_length: Number((api_request.query as any).size)
				};
				const atom_media = await urn_media_bll.presigned((api_request.query as any).filename, params);
				return atom_media;
			};
	}
	
	(default_routes.count as any).call =
		async <A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth=0>(api_request:types.Api.Request<A,R,D>) => {
			urn_log.fn_debug(`Router Call GET [count] / [${atom_name}]`);
			const urn_bll = core.bll.create(atom_name, api_request.passport) as
				core.bll.BLL<A>;
			const filter = (api_request.query as unknown as any).filter || {};
			const bll_res = await urn_bll.count(filter as any);
			return bll_res;
		};
	
	(default_routes.find_one as any).call =
		async <A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth=0>(api_request:types.Api.Request<A,R,D>) => {
			urn_log.fn_debug(`Router Call GET [find_one] / [${atom_name}]`);
			const urn_bll = core.bll.create(atom_name, api_request.passport) as
				core.bll.BLL<A>;
			const filter = (api_request.query as types.Api.Request.Query<'superuser', 'find', D>).filter || {};
			const options = (api_request.query as types.Api.Request.Query<'superuser', 'find', D>).options;
			const bll_res = await urn_bll.find_one(filter as any, options as any);
			return bll_res;
		};
	
	(default_routes.find as any).call =
		async <A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth=0>(api_request:types.Api.Request<A,R,D>) => {
			urn_log.fn_debug(`Router Call GET [find] / [${atom_name}]`);
			const urn_bll = core.bll.create(atom_name, api_request.passport) as
				core.bll.BLL<A>;
			const filter = (api_request.query as types.Api.Request.Query<'superuser', 'find', D>).filter || {};
			const options = (api_request.query as types.Api.Request.Query<'superuser', 'find', D>).options;
			const bll_res = await urn_bll.find(filter as any, options as any);
			return bll_res;
		};
	
	(default_routes.find_id as any).call =
		async <A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth=0>(api_request:types.Api.Request<A,R,D>) => {
			urn_log.fn_debug(`Router Call GET [find_id] /:id [${atom_name}]`);
			const urn_bll = core.bll.create(atom_name, api_request.passport) as
				core.bll.BLL<A>;
			const bll_res = await urn_bll.find_by_id(
				(api_request.params as types.Api.Request.Params<'superuser', 'find_id'>).id!,
				(api_request.query as types.Api.Request.Query<'superuser', 'find_id', D> as any).options
			);
			return bll_res;
		};
	
	(default_routes.insert as any).call =
		async <A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth=0>(api_request:types.Api.Request<A,R,D>) => {
			urn_log.fn_debug(`Router Call POST [insert] / [${atom_name}]`);
			const urn_bll = core.bll.create(atom_name, api_request.passport) as
				core.bll.BLL<A>;
			if(!api_request.body){
				throw urn_exc.create_invalid_request(
					`INVALID_REQUEST_BODY`,
					`Invalid request body.`
				);
			}
			// if(Array.isArray(api_request.body)){
			//   return await urn_bll.insert_multiple(api_request.body);
			// }
			const bll_res = await urn_bll.insert_new(api_request.body as any);
			return bll_res;
		};
	
	(default_routes.update as any).call =
		async <A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth=0>(api_request:types.Api.Request<A,R,D>) => {
			urn_log.fn_debug(`Router Call POST [update] / [${atom_name}]`);
			const urn_bll = core.bll.create(atom_name, api_request.passport) as
				core.bll.BLL<A>;
			if(!api_request.body){
				throw urn_exc.create_invalid_request(
					`INVALID_REQUEST_UPDATE_BODY`,
					`Invalid request body.`
				);
			}
			if(!api_request.params || !(api_request.params as any).id){
				throw urn_exc.create_invalid_request(
					`INVALID_REQUEST_PARAM_ID`,
					`Invalid request parameter \`id\`.`
				);
			}
			// const ids = api_request.params?.id?.split(',') || [];
			// if(ids.length > 1){
			//   return await urn_bll.update_multiple(ids, api_request.body);
			// }
			const bll_res = await urn_bll.update_by_id(
				(api_request.params as any)?.id,
				api_request.body as unknown as Partial<schema.AtomShape<A>>
			);
			return bll_res;
		};
	
	(default_routes.delete as any).call =
		async <A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth=0>(api_request:types.Api.Request<A,R,D>) => {
			urn_log.fn_debug(`Router Call DELETE [delete] / [${atom_name}]`);
			const urn_bll = core.bll.create(atom_name, api_request.passport) as
				core.bll.BLL<A>;
			if(!(api_request.params as any)?.id){
				throw urn_exc.create_invalid_request(
					`INVALID_REQUEST_DELETE_PARAM_ID`,
					`Invalid request parameter \`id\`.`
				);
			}
			// const ids = api_request.params.id?.split(',') || [];
			// if(ids.length > 1){
			//   return await urn_bll.remove_multiple(ids);
			// }
			const bll_res = await urn_bll.remove_by_id((api_request.params as any).id);
			return bll_res;
		};
	
	(default_routes.insert_multiple as any).call =
		async <A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth=0>(api_request:types.Api.Request<A,R,D>) => {
			urn_log.fn_debug(`Router Call POST [insert_multiple] / [${atom_name}]`);
			const urn_bll = core.bll.create(atom_name, api_request.passport) as
				core.bll.BLL<A>;
			if(!api_request.body || !Array.isArray(api_request.body)){
				throw urn_exc.create_invalid_request(
					`INVALID_REQUEST_INSERT_MULTIPLE_BODY`,
					`Invalid request body.`
				);
			}
			return await urn_bll.insert_multiple(api_request.body);
		};
	
	(default_routes.update_multiple as any).call =
		async <A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth=0>(api_request:types.Api.Request<A,R,D>) => {
			urn_log.fn_debug(`Router Call POST [update_multiple] / [${atom_name}]`);
			const urn_bll = core.bll.create(atom_name, api_request.passport) as
				core.bll.BLL<A>;
			if(!api_request.body){
				throw urn_exc.create_invalid_request(
					`INVALID_REQUEST_UPDATE_MULTIPLE_BODY`,
					`Invalid request body.`
				);
			}
			if(!(api_request.params as any)?.ids){
				throw urn_exc.create_invalid_request(
					`INVALID_REQUEST_UPDATE_MULTIPLE_PARAM_IDS`,
					`Invalid request parameter \`ids\`.`
				);
			}
			const ids = (api_request.params as any)?.ids?.split(',') || [];
			return await urn_bll.update_multiple(ids, api_request.body as unknown as Partial<schema.AtomShape<A>>);
		};
	
	(default_routes.delete_multiple as any).call =
		async <A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth=0>(api_request:types.Api.Request<A,R,D>) => {
			urn_log.fn_debug(`Router Call DELETE [delete_multiple] / [${atom_name}]`);
			const urn_bll = core.bll.create(atom_name, api_request.passport) as
				core.bll.BLL<A>;
			if(!(api_request.params as any)?.ids){
				throw urn_exc.create_invalid_request(
					`INVALID_REQUEST_DELETE_MULTIPLE_PARAM_IDS`,
					`Invalid request parameter \`ids\`.`
				);
			}
			const ids = ((api_request.params as any).ids)?.split(',') || [];
			return await urn_bll.remove_multiple(ids);
		};
	
	(default_routes.search as any).call =
		async <A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth=0>(api_request:types.Api.Request<A,R,D>) => {
			urn_log.fn_debug(`Router Call GET [search] / [${atom_name}]`);
			const urn_bll = core.bll.create(atom_name, api_request.passport) as
				core.bll.BLL<A>;
			const q = (api_request.params as types.Api.Request.Params<'superuser', 'search'>).q;
			const options = (api_request.query as types.Api.Request.Query<'superuser', 'find', D>).options;
			const bll_res = await urn_bll.search(q || '', options as any);
			return bll_res;
		};
	
	return default_routes as unknown as types.Book.Definition.Dock.Routes<A>;
	
}
