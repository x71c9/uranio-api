/**
 * Lambda index module
 *
 * @packageDocumentation
 */

import * as conf from '../conf/';

import * as netlify from './netlify/';

import {Lambda, LambdaName} from './types';

export * from './types';

export function create(lambda_name?:LambdaName)
		:Lambda{
	const lambda = lambda_name || conf.get(`lambda`);
	switch(lambda){
		case 'netlify':{
			return netlify.create();
		}
	}
}

// export function connect_and_create(lambda_name?:LambdaName)
//     :Lambda{
//   const lambda = lambda_name || conf.get(`lambda`);
//   switch(lambda){
//     case 'netlify':{
//       return netlify.connect_and_create();
//     }
//   }
// }
