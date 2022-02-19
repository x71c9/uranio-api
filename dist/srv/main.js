"use strict";
/**
 * Main module for server
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = exports.log = exports.util = exports.conf = exports.book = exports.routes = exports.lambda = exports.service = exports.core = void 0;
const uranio_core_1 = __importDefault(require("uranio-core"));
exports.core = uranio_core_1.default;
__exportStar(require("../sch/index"), exports);
const service = __importStar(require("../service/index"));
exports.service = service;
const lambda = __importStar(require("../lambda/index"));
exports.lambda = lambda;
const routes = __importStar(require("../routes/index"));
exports.routes = routes;
const book = __importStar(require("../book/index"));
exports.book = book;
const conf = __importStar(require("../conf/index"));
exports.conf = conf;
const util = __importStar(require("../util/index"));
exports.util = util;
const log = __importStar(require("../log/index"));
exports.log = log;
const types = __importStar(require("./types"));
exports.types = types;
__exportStar(require("../init/index"), exports);
__exportStar(require("../reg/index"), exports);
//# sourceMappingURL=main.js.map