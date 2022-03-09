"use strict";
/**
 * Conf module
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.set = exports.set_initialize = exports.is_initialized = exports.get_current = exports.get = exports.defaults = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('CONF_API_MODULE', `Api configuration module`);
const uranio_core_1 = __importDefault(require("uranio-core"));
const defaults_1 = require("./defaults");
Object.defineProperty(exports, "defaults", { enumerable: true, get: function () { return defaults_1.api_config; } });
const env = __importStar(require("../env/server"));
let _is_api_initialized = false;
function get(param_name) {
    _check_if_uranio_was_initialized();
    _check_if_param_exists(param_name);
    return defaults_1.api_config[param_name];
}
exports.get = get;
function get_current(param_name) {
    const pro_value = uranio_core_1.default.conf.get_current(param_name);
    if (env.is_production()) {
        return pro_value;
    }
    if (param_name.indexOf('service_') !== -1) {
        const dev_param = param_name.replace('service_', 'service_dev_');
        const dev_value = get(dev_param);
        if (typeof dev_value === typeof defaults_1.api_config[dev_param]) {
            return dev_value;
        }
    }
    return pro_value;
}
exports.get_current = get_current;
function is_initialized() {
    return uranio_core_1.default.conf.is_initialized() && _is_api_initialized;
}
exports.is_initialized = is_initialized;
function set_initialize(is_initialized) {
    _is_api_initialized = is_initialized;
}
exports.set_initialize = set_initialize;
// export function set_from_env(repo_config:Required<types.Configuration>)
//     :void{
//   return core.conf.set_from_env(repo_config);
// }
function set(repo_config, config) {
    return uranio_core_1.default.conf.set(repo_config, config);
}
exports.set = set;
function _check_if_param_exists(param_name) {
    return urn_lib_1.urn_util.object.has_key(defaults_1.api_config, param_name);
}
function _check_if_uranio_was_initialized() {
    if (is_initialized() === false) {
        throw urn_exc.create_not_initialized(`NOT_INITIALIZED`, `Uranio was not initialized. Please run \`uranio.init()\` in your main file.`);
    }
}
//# sourceMappingURL=server.js.map