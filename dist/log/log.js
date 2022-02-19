"use strict";
/**
 * Log module
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const urn_lib_1 = require("urn-lib");
const uranio_core_1 = __importDefault(require("uranio-core"));
function init(log_config) {
    /**
     * This "if else" is needed otherwise Typescript will complain
     * the overloads don't match.
     */
    if (typeof log_config === 'number') {
        uranio_core_1.default.log.init(log_config);
        urn_lib_1.urn_log.init(log_config);
    }
    else {
        uranio_core_1.default.log.init(log_config);
        urn_lib_1.urn_log.init(log_config);
    }
}
exports.init = init;
//# sourceMappingURL=log.js.map