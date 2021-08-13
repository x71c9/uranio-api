/**
 * Request types module
 *
 * @packageDocumentation
 */

import urn_core from 'uranio-core';

export const enum RouteMethod {
	GET = 'GET',
	POST = 'POST',
	DELETE = 'DELETE'
}

export type ApiRequestPaths = {
	full_path: string
	route_path: string
	atom_path: string
	connection_path: string
}

export type ApiRequest =
	ApiRequestPaths & {
	method: RouteMethod,
	atom_name: urn_core.types.AtomName
	route_name: string
	is_auth: boolean
	auth_action: urn_core.types.AuthAction
	params: ApiRequestParams
	query: ApiRequestQuery
	body?: any
	headers?: ApiRequestHeaders
	ip?: string,
	passport?: urn_core.types.Passport
}

export type ApiRequestHeaders = {
	[k:string]: string | undefined
}

export type ApiRequestParams = {
	[k:string]: string |  undefined
}

export type ApiRequestQuery = {
	[k:string]: any
}

export type AuthHandler = (api_request:ApiRequest) => Promise<string>;

