/**
 * Log module
 *
 * @packageDocumentation
 */

import {urn_log} from 'uranio-utils';

// import core from 'uranio-core';

import * as conf from '../conf/server';

import * as env from '../env/server';

export function init(urn_log_lib:typeof urn_log):void{
	// return core.log.init(urn_log_lib);
	urn_log_lib.init({
		log_level: env.get(`log_level`),
		debug_info: conf.get(`log_debug_info`),
		color: conf.get(`log_color`),
		time_format: conf.get(`log_time_format`),
		max_str_length: conf.get(`log_max_str_length`),
		prefix: conf.get(`log_prefix`),
		prefix_log_type: conf.get(`log_prefix_type`),
	});
}

// export function init(log_config?: urn_log.LogLevel):void
// export function init(log_config?: urn_log.LogConfig):void
// export function init(log_config?: urn_log.LogConfig | urn_log.LogLevel):void{
//   /**
//    * This "if else" is needed otherwise Typescript will complain
//    * the overloads don't match.
//    */
//   if(typeof log_config === 'number'){
//     core.log.init(log_config);
//     urn_log.init(log_config);
//   }else{
//     core.log.init(log_config);
//     urn_log.init(log_config);
//   }
// }

