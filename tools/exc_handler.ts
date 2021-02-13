/**
 * Module for handling exceptions and rejected promises
 *
 * @packageDocumentation
 */

import urn_core from 'urn_core';

const bll_errors = urn_core.bll.create_log('error');
/*
 * Function for handling exception.
 * It should log the exception and stop the application.
 *
 * @params ex - The exception
 */
async function handleException(ex:Error)
		:Promise<void>{
	console.error(ex);
	try {
		await bll_errors.insert_new({
			status: 500,
			msg: 'UnhandledException',
			error_code: '500',
			error_msg: ex.message,
			stack: ex.stack
		});
	}catch(ex){
		// TODO
	}
	process.exit(1);
}

/*
 * Function for handling rejected promises.
 * It should log the rejected promise and stop the application.
 *
 * @param reason - the reason
 * @param promise - the promise
 */
async function handleRejectedPromise(reason:any, promise:Promise<any>)
		:Promise<void>{
	console.error(reason, promise);
	try {
		await bll_errors.insert_new({
			status: 510,
			msg: 'UnhandledRejectedPromise',
			error_code: '510',
			error_msg: JSON.stringify(reason),
			stack: JSON.stringify(promise)
		});
	}catch(ex){
		// TODO
	}
	process.exit(1);
}

/*
 * Function that will assign to process uncaughtException handleException and
 * to unhandledRejection handleRejectionPromise functions.
 */
function registerExceptionHandler():void {
	process.on('uncaughtException', handleException);
	process.on('unhandledRejection', handleRejectedPromise);
}

/*
 * Calling registerExceptionHandler
 */
registerExceptionHandler();
