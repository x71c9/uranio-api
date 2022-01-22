/**
 * Server part of routes module
 *
 * @packageDocumentation
 */

import {urn_log, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init(`API_ROUTE_SERVER`, `Api route server module`);

import urn_core from 'uranio-core';

import * as types from '../types';

import {Book as ClientBook} from '../typ/book_cln';

import {add_media_routes, default_routes as cln_default_routes} from './client';

import {
	route_def as common_route_def,
	atom_dock_with_defaults as common_atom_dock_with_defaults
} from './common';

export function route_def<A extends types.AtomName, R extends types.RouteName<A>>(atom_name:A, route_name:R)
		:types.Book.Definition.Dock.Routes.Route<A,R>{
	const server_default_routes = return_default_routes(atom_name) as ClientBook.Definition.Dock.Routes;
	return common_route_def(server_default_routes, atom_name, route_name);
}

export function atom_dock_with_defaults<A extends urn_core.types.AtomName>(
	default_routes:ClientBook.Definition.Dock.Routes,
	atom_name:A
):types.Book.Definition.Dock<A>{
	return common_atom_dock_with_defaults(default_routes, atom_name) as types.Book.Definition.Dock<A>;
}

export function return_default_routes<A extends urn_core.types.AtomName>(atom_name:A)
		:types.Book.Definition.Dock.Routes<A>{
	
	let default_routes = cln_default_routes;
	
	if(atom_name === 'media'){
		
		default_routes = add_media_routes();
		
		((default_routes as any).upload as any).call =
			async <D extends types.Depth>(api_request:types.Api.Request<typeof atom_name, 'count', D>) => {
				urn_log.fn_debug(`Router Call POST [upload] / [${atom_name}]`);
				if(!api_request.file){
					throw urn_exc.create_invalid_request(
						`INVALID_REQUEST_MISSING_FILE_PARAM`,
						`Missing file param in api_request on upload media route.`
					);
				}
				const urn_media_bll = urn_core.bll.media.create(api_request.passport);
				const params = {
					override: false,
					content_type: api_request.file.mime_type,
					content_length: api_request.file.size
				};
				const atom_media = await urn_media_bll.insert_file(api_request.file.name, api_request.file.data, params);
				return atom_media;
			};
			
		((default_routes as any).presigned as any).call =
			async <D extends types.Depth>(api_request:types.Api.Request<typeof atom_name, 'count', D>) => {
				urn_log.fn_debug(`Router Call GET [presigned] / [${atom_name}]`);
				if(!api_request.query){
					throw urn_exc.create_invalid_request(
						`INVALID_REQUEST_MISSING_QUERY`,
						`Missing query in api_request on presigned media route.`
					);
				}
				const urn_media_bll = urn_core.bll.media.create(api_request.passport);
				const params = {
					content_type: (api_request.query as any).type,
					content_length: Number((api_request.query as any).size)
				};
				const atom_media = await urn_media_bll.presigned((api_request.query as any).filename, params);
				return atom_media;
			};
	}
	
	// (default_routes.count as unknown as types.Book.Definition.Dock.Routes.Route<typeof atom_name,'count', any>).call =
	(default_routes.count as any).call =
		async <D extends types.Depth>(api_request:types.Api.Request<typeof atom_name, 'count', D>) => {
			urn_log.fn_debug(`Router Call GET [count] / [${atom_name}]`);
			const urn_bll = urn_core.bll.create(atom_name, api_request.passport) as
				urn_core.bll.BLL<typeof atom_name>;
			const filter = (api_request.query as types.Api.Request.Query<'superuser', 'count', D>).filter || {};
			const bll_res = await urn_bll.count(filter as any);
			return bll_res;
		};
	
	// (default_routes.find_one as unknown as types.Book.Definition.Dock.Routes.Route<typeof atom_name, 'find_one', any>).call =
	(default_routes.find_one as any).call =
		async <D extends types.Depth>(api_request:types.Api.Request<typeof atom_name, 'find_one', D>) => {
			urn_log.fn_debug(`Router Call GET [find_one] / [${atom_name}]`);
			const urn_bll = urn_core.bll.create(atom_name, api_request.passport) as
				urn_core.bll.BLL<typeof atom_name>;
			const filter = (api_request.query as types.Api.Request.Query<'superuser', 'find', D>).filter || {};
			const options = (api_request.query as types.Api.Request.Query<'superuser', 'find', D>).options;
			const bll_res = await urn_bll.find_one(filter as any, options as any);
			return bll_res;
		};
	
	// (default_routes.find as unknown as types.Book.Definition.Dock.Routes.Route<typeof atom_name, 'find', any>).call =
	(default_routes.find as any).call =
		async <D extends types.Depth>(api_request:types.Api.Request<typeof atom_name,'find', D>) => {
			urn_log.fn_debug(`Router Call GET [find] / [${atom_name}]`);
			const urn_bll = urn_core.bll.create(atom_name, api_request.passport) as
				urn_core.bll.BLL<typeof atom_name>;
			const filter = (api_request.query as types.Api.Request.Query<'superuser', 'find', D>).filter || {};
			const options = (api_request.query as types.Api.Request.Query<'superuser', 'find', D>).options;
			const bll_res = await urn_bll.find(filter as any, options as any);
			return bll_res;
		};
	
	// (default_routes.find_id as unknown as types.Book.Definition.Dock.Routes.Route<typeof atom_name, 'find_id', any>).call =
	(default_routes.find_id as any).call =
		async <D extends types.Depth>(api_request:types.Api.Request<typeof atom_name, 'find_id', D>) => {
			urn_log.fn_debug(`Router Call GET [find_id] /:id [${atom_name}]`);
			const urn_bll = urn_core.bll.create(atom_name, api_request.passport) as
				urn_core.bll.BLL<typeof atom_name>;
			const bll_res = await urn_bll.find_by_id(
				(api_request.params as types.Api.Request.Params<'superuser', 'find_id'>).id!,
				(api_request.query as types.Api.Request.Query<'superuser', 'find_id', D> as any).options
			);
			return bll_res;
		};
	
	// (default_routes.insert as unknown as types.Book.Definition.Dock.Routes.Route<typeof atom_name, 'insert', any>).call =
	(default_routes.insert as any).call =
		async <D extends types.Depth>(api_request:types.Api.Request<typeof atom_name, 'insert', D>) => {
			urn_log.fn_debug(`Router Call POST [insert] / [${atom_name}]`);
			const urn_bll = urn_core.bll.create(atom_name, api_request.passport) as
				urn_core.bll.BLL<typeof atom_name>;
			const bll_res = await urn_bll.insert_new(api_request.body);
			return bll_res;
		};
	
	// (default_routes.update as unknown as types.Book.Definition.Dock.Routes.Route<typeof atom_name, 'update', any>).call =
	(default_routes.update as any).call =
		async <D extends types.Depth>(api_request:types.Api.Request<typeof atom_name, 'update', D>) => {
			urn_log.fn_debug(`Router Call POST [update] / [${atom_name}]`);
			const urn_bll = urn_core.bll.create(atom_name, api_request.passport) as
				urn_core.bll.BLL<typeof atom_name>;
			const bll_res = await urn_bll.update_by_id(
				(api_request.params as types.Api.Request.Params<'superuser', 'find_id'>).id!,
				api_request.body
			);
			return bll_res;
		};
	
	// (default_routes.delete as unknown as types.Book.Definition.Dock.Routes.Route<typeof atom_name, 'delete', any>).call =
	(default_routes.delete as any).call =
		async <D extends types.Depth>(api_request:types.Api.Request<typeof atom_name, 'delete', D>) => {
			urn_log.fn_debug(`Router Call DELETE [delete] / [${atom_name}]`);
			const urn_bll = urn_core.bll.create(atom_name, api_request.passport) as
				urn_core.bll.BLL<typeof atom_name>;
			const id = (api_request.params as types.Api.Request.Params<'superuser', 'find_id'>).id!;
			const bll_res = await urn_bll.remove_by_id(id);
			return bll_res;
		};
	
	return default_routes as unknown as types.Book.Definition.Dock.Routes<A>;
	
}
