/**
 * Route types module
 *
 * @packageDocumentation
 */

import {AtomName} from 'uranio-core/types';

import {dock_book} from 'uranio-books-client/dock';

import {default_routes} from '../routes/client';

type AtomDockProp<A extends AtomName> = typeof dock_book[A]['dock'];

export type RouteDefaultName =
	keyof typeof default_routes extends string ?
	keyof typeof default_routes :
	never;

// This format is preferable than abstracting the types becase it will show
// all the possibilities when a string doesn't match one of the route name.
export type RouteName<A extends AtomName> =
	'routes' extends keyof AtomDockProp<A> ?
	keyof AtomDockProp<A>['routes'] | RouteDefaultName:
	RouteDefaultName;

// export const a:RouteName<'user'> = '';
