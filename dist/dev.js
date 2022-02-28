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
__exportStar(require("./server/register"), exports);
const urn_lib_1 = require("urn-lib");
urn_lib_1.urn_log.init({
    log_level: urn_lib_1.urn_log.LogLevel.FUNCTION_DEBUG,
    debug_info: false,
    color: true
});
const server_1 = __importDefault(require("./server"));
server_1.default.init();
// import * as book from './book/server';
// import * as register from './reg/server';
// register.route<'user', 'find'>((route_request: uranio.types.Api.Request<'user','find',0>) => {
//   console.log(route_request);
// },'user', 'find');
// const atom_book = book.get_route_definition('user', 'find');
// console.log(atom_book.call?.toString());
//# sourceMappingURL=dev.js.map