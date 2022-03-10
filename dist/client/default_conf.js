"use strict";
/**
 * Module for default client configuration object
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_client_config = void 0;
const client_1 = __importDefault(require("uranio-core/client"));
/**
 * IMPORTANT: if new variable are added here they must be added on
 * uranio-trx/conf/client.ts
 *
 * Unfortunately the browser doesn't allow to dynamically access process.env
 * variable, like process.env[var_name] where `var_name` is a variable.
 */
exports.api_client_config = {
    ...client_1.default.conf.get_all(),
    prefix_log: '/logs'
};
//# sourceMappingURL=default_conf.js.map