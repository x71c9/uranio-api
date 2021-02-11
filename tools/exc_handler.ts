/**
 * Module for handling exceptions and rejected promises
 *
 * @packageDocumentation
 */

/*
 * Function for handling exception.
 * It should log the exception and stop the application.
 *
 * @params ex - The exception
 */
function handleException(ex:Error):void{
	// urn_console.error('URANIO UncaughtException', ex);
	console.error(ex);
	process.exit(1);
}

/*
 * Function for handling rejected promises.
 * It should log the rejected promise and stop the application.
 *
 * @param reason - the reason
 * @param promise - the promise
 */
function handleRejectedPromise(reason:any, promise:Promise<any>):void{
	// urn_console.error('URANIO UnhandledRejection', reason, promise);
	console.error(reason, promise);
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
