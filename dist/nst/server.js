"use strict";
/**
 * API Instances index module
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_bll_error = exports.get_bll_request = void 0;
const uranio_core_1 = __importDefault(require("uranio-core"));
let api_bll_request;
let api_bll_error;
function get_bll_request() {
    if (!api_bll_request) {
        api_bll_request = uranio_core_1.default.bll.basic.create('request');
    }
    return api_bll_request;
}
exports.get_bll_request = get_bll_request;
function get_bll_error() {
    if (!api_bll_error) {
        api_bll_error = uranio_core_1.default.bll.basic.create('error');
    }
    return api_bll_error;
}
exports.get_bll_error = get_bll_error;
//# sourceMappingURL=server.js.map