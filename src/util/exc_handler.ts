/**
 * Module for handling exceptions and rejected promises
 *
 * @packageDocumentation
 */

import * as conf from '../conf/server';

import * as insta from '../nst/server';

/*
 * Function for handling exception.
 * It should log the exception and stop the application.
 *
 * @params ex - The exception
 */
function handle_exception(service_name:string)
		:(...args:any[]) => any {
	return async (ex:Error):Promise<void> => {
		console.error(service_name, ex);
		if(conf.get('default_atoms_error') === false){
			return;
		}
		const bll_err = insta.get_bll_error();
		bll_err.insert_new({
			status: 500,
			msg: `[${service_name}] UnhandledException`,
			error_code: '500',
			error_msg: ex.message,
			stack: ex.stack
		}).catch((_ex) => {
			// TODO
		});
		// process.exit(1);
	};
}

/*
 * Function for handling rejected promises.
 * It should log the rejected promise and stop the application.
 *
 * @param reason - the reason
 * @param promise - the promise
 */
function handle_rejected_promise(service_name:string)
		:(...args:any[]) => any {
	return (reason:any, promise:Promise<any>):void => {
		console.error(service_name, reason, promise);
		if(conf.get('default_atoms_error') === false){
			return;
		}
		const bll_err = insta.get_bll_error();
		bll_err.insert_new({
			status: 510,
			msg: `[${service_name}] UnhandledRejectedPromise`,
			error_code: '510',
			error_msg: JSON.stringify(reason),
			stack: JSON.stringify(promise)
		}).catch((_ex) => {
			// TODO
		});
		// process.exit(1);
	};
}

/*
 * Function that will assign to process uncaughtException handle_exception and
 * to unhandledRejection handleRejectionPromise functions.
 */
export function register_exception_handler(name:string):void {
	
	process.on('uncaughtException', handle_exception(name));
	process.on('unhandledRejection', handle_rejected_promise(name));
	
}

/*
 * Calling register_exception_handler
 */
// register_exception_handler();
