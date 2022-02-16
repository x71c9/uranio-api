"use strict";
/**
 * Api run module
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./register"), exports);
const index_1 = __importDefault(require("./index"));
index_1.default.init();
const service = index_1.default.service.create();
service.listen(() => {
    console.log(`Listening on port ${index_1.default.conf.get(`service_port`)}...`);
});
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
//# sourceMappingURL=run.js.map