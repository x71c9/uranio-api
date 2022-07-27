"use strict";
/**
 * Module for default environment object
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api_env = void 0;
const uranio_core_1 = __importDefault(require("uranio-core"));
exports.api_env = {
    ...uranio_core_1.default.env.get_all(),
    https: true,
    ssl_certificate: '',
    ssl_key: ''
};
//# sourceMappingURL=defaults.js.map