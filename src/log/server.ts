/**
 * Log module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

import core from 'uranio-core';

export function init(urn_log_lib:typeof urn_log):void{
	return core.log.init(urn_log_lib);
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

