"use strict";
/**
 * Main module for client
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = exports.register = exports.conf = exports.log = exports.book = exports.types = exports.schema = exports.core = void 0;
const client_1 = __importDefault(require("uranio-core/client"));
exports.core = client_1.default;
const client_2 = require("../sch/client");
Object.defineProperty(exports, "schema", { enumerable: true, get: function () { return client_2.schema; } });
const routes = __importStar(require("../routes/client"));
exports.routes = routes;
const book = __importStar(require("../book/client"));
exports.book = book;
const log = __importStar(require("../log/client"));
exports.log = log;
const types = __importStar(require("./types"));
exports.types = types;
const conf = __importStar(require("../conf/client"));
exports.conf = conf;
const register = __importStar(require("../reg/client"));
exports.register = register;
__exportStar(require("../init/client"), exports);
//# sourceMappingURL=main.js.map