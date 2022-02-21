/**
 * Api run module
 *
 * @packageDocumentation
 */

export * from './register';

import {urn_log} from 'urn-lib';
urn_log.init({
	log_level: urn_log.LogLevel.FUNCTION_DEBUG,
	debug_info: false,
	color: true
});

import uranio from './index';
uranio.init();

// console.log(uranio.conf.defaults.prefix_api);

// const service = uranio.service.create();

// service.listen(() => {
//   urn_log.debug(`Listening on port ${uranio.conf.get(`service_port`)}...`);
// });

// import uranio_core from 'uranio-core';

// console.log(uranio_core);

// import uranio_core_client from 'uranio-core/client';

// console.log(uranio_core_client);

// import api from './index';

// import {urn_log} from 'urn-lib';

// urn_log.defaults.log_level = urn_log.LogLevel.FUNCTION_DEBUG;

// import urn_api from './index';

// // console.log(urn_api.lib.log.defaults);

// // const express_service = urn_api.service.create();

// // express_service.listen(3000, () => {
// //   urn_log.debug(`Listening on port 3000...`);
// // });

// import * as types from './types';

// const event = {
//   rawURL: '',
//   rawQuery: '',
//   path: '/uranio/api/requests',
//   httpMethod: types.RouteMethod.GET,
//   headers: {},
//   multiValueHeaders: {},
//   queryStringParameters: null,
//   multiValueQueryStringParametes: null,
//   body: null,
//   isBase64Encoded: false
// };
// const context = {
//   callbackWaitsForEmptyEventLoop: false,
//   functionName: '',
//   functionVersion: '',
//   invokedFunctionArn: '',
//   memoryLimitInMB: '',
//   awsRequestId: '',
//   logGroupName: '',
//   logStreamName: '',
//   getRemainingTimeInMillis: () => 3
// };
// const urn_lambda = urn_api.lambda.create();
// urn_lambda.handle(event, context).then((_r) => {
//   console.log(_r);
// });
