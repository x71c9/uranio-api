/**
 * Api run module
 *
 * @packageDocumentation
 */

export * from './server/register';

import {urn_log} from 'urn-lib';
urn_log.init({
	log_level: urn_log.LogLevel.FUNCTION_DEBUG,
	debug_info: false,
	color: true
});

import uranio from './server';
uranio.init();

// import * as book from './book/server';

// import * as register from './reg/server';

// register.route<'user', 'find'>((route_request: uranio.types.Api.Request<'user','find',0>) => {
//   console.log(route_request);
// },'user', 'find');

// const atom_book = book.get_route_definition('user', 'find');
// console.log(atom_book.call?.toString());
