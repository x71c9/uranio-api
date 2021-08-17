/**
 * Route types module
 *
 * @packageDocumentation
 */

import {AtomName} from 'uranio-core/types';

import {api_book} from 'uranio-books-client/api';

import {default_routes} from '../routes/client';

type AtomApiProp<A extends AtomName> = typeof api_book[A]['api'];

export type RouteDefaultName =
	keyof typeof default_routes extends string ?
	keyof typeof default_routes :
	never;

// This format is preferable than abstracting the types becase it will show
// all the possibilities when a string doesn't match one of the route name.
export type RouteName<A extends AtomName> =
	'routes' extends keyof AtomApiProp<A> ?
	keyof AtomApiProp<A>['routes'] | RouteDefaultName:
	RouteDefaultName;

// export const a:RouteName<'user'> = '';
