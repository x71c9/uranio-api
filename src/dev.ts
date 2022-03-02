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

// uranio.register.atom({
//   properties:{
//     title:{
//       type: uranio.types.PropertyType.TEXT,
//       label: 'Title'
//     }
//   },
//   dock:{
//     url: '/products'
//   }
// },'product');

// uranio.register.route({
//   method: uranio.types.RouteMethod.GET,
//   url: '/add',
//   action: uranio.types.AuthAction.READ,
//   call:(r:any) => {
//     console.log(r);
//   }
// }, 'product' as any, 'add' as any);

// const atom_book = book.get_all_definitions() as any;
// console.log(atom_book.product.dock.routes.add.call.toString());

