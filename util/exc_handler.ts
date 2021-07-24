/**
 * Module for handling exceptions and rejected promises
 *
 * @packageDocumentation
 */

import urn_core from 'uranio-core';

// const bll_errors = urn_core.bll.log.create('error');

/*
 * Function for handling exception.
 * It should log the exception and stop the application.
 *
 * @params ex - The exception
 */
function handle_exception(service_name:string, bll_errors:urn_core.bll.BLL<'error'>)
		:(...args:any[]) => any {
	return async (ex:Error):Promise<void> => {
		console.error(service_name, ex);
		try {
			await bll_errors.insert_new({
				status: 500,
				msg: `[${service_name}] UnhandledException`,
				error_code: '500',
				error_msg: ex.message,
				stack: ex.stack
			});
		}catch(ex){
			// TODO
		}
		process.exit(1);
	};
}

/*
 * Function for handling rejected promises.
 * It should log the rejected promise and stop the application.
 *
 * @param reason - the reason
 * @param promise - the promise
 */
function handle_rejected_promise(service_name:string, bll_errors:urn_core.bll.BLL<'error'>)
		:(...args:any[]) => any {
	return async (reason:any, promise:Promise<any>):Promise<void> => {
		console.error(service_name, reason, promise);
		try {
			await bll_errors.insert_new({
				status: 510,
				msg: `[${service_name}] UnhandledRejectedPromise`,
				error_code: '510',
				error_msg: JSON.stringify(reason),
				stack: JSON.stringify(promise)
			});
		}catch(ex){
			// TODO
		}
		process.exit(1);
	};
}

/*
 * Function that will assign to process uncaughtException handle_exception and
 * to unhandledRejection handleRejectionPromise functions.
 */
export function register_exception_handler(name:string, bll_errors:urn_core.bll.BLL<'error'>):void {
	
	process.on('uncaughtException', handle_exception(name, bll_errors));
	process.on('unhandledRejection', handle_rejected_promise(name, bll_errors));
	
}

/*
 * Calling register_exception_handler
 */
// register_exception_handler();
