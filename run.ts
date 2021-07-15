/**
 * Web run module
 *
 * @packageDocumentation
 */

import {urn_log} from 'urn-lib';

urn_log.defaults.log_level = urn_log.LogLevel.FUNCTION_DEBUG;

import urn_web from './index';

// const express_service = urn_web.service.create();

// express_service.listen(3000, () => {
//   urn_log.debug(`Listening on port 3000...`);
// });

const event = {
	rawURL: '',
	rawQuery: '',
	path: '/uranio/api/superusers',
	httpMethod: 'GET',
	headers: {},
	multiValueHeaders: {},
	queryStringParameters: null,
	multiValueQueryStringParametes: null,
	body: null,
	isBase64Encoded: false
};
const context = {
	callbackWaitsForEmptyEventLoop: false,
	functionName: '',
	functionVersion: '',
	invokedFunctionArn: '',
	memoryLimitInMB: '',
	awsRequestId: '',
	logGroupName: '',
	logStreamName: '',
	getRemainingTimeInMillis: () => 3
};

urn_web.lambda.handle(event, context).then((_r) => {
	// console.log(r);
});
