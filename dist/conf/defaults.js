"use strict";
/**
 * Module for default configuration object
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_config = void 0;
const uranio_core_1 = __importDefault(require("uranio-core"));
exports.api_config = {
    ...uranio_core_1.default.conf.defaults,
    request_auto_limit: 128,
    service: 'express',
    service_protocol: 'http',
    service_domain: 'localhost',
    service_port: 3000,
    lambda: 'netlify',
    prefix_api: '/uranio/api',
    prefix_log: '/logs',
};
//# sourceMappingURL=defaults.js.map