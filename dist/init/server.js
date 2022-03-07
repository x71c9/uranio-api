"use strict";
/**
 * Init module
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
exports.init = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('INIT_API_MODULE', `Api init module`);
const uranio_core_1 = __importDefault(require("uranio-core"));
const config_1 = __importDefault(require("../config"));
const defaults_1 = require("../conf/defaults");
const defaults_2 = require("../env/defaults");
const register = __importStar(require("../reg/server"));
const required = __importStar(require("../req/server"));
const conf = __importStar(require("../conf/server"));
const env = __importStar(require("../env/server"));
const book = __importStar(require("../book/server"));
const log = __importStar(require("../log/server"));
function init(config, register_required = true) {
    log.init(urn_lib_1.urn_log.defaults);
    uranio_core_1.default.init(config, false);
    env.set_from_env(defaults_2.api_env);
    conf.set(defaults_1.api_config, config_1.default);
    if (config) {
        conf.set(defaults_1.api_config, config);
    }
    if (register_required) {
        _register_required_atoms();
    }
    _validate_api_variables();
    _validate_api_book();
    conf.set_initialize(true);
    env.set_initialize(true);
    urn_lib_1.urn_log.defaults.log_level = env.get(`log_level`);
}
exports.init = init;
function _register_required_atoms() {
    const required_atoms = required.get();
    for (const [atom_name, atom_def] of Object.entries(required_atoms)) {
        register.atom(atom_def, atom_name);
    }
}
/**
 * NOTE:
 * Maybe this should be before compilation and not at runtime?
 */
function _validate_api_book() {
    _validate_dock_url_uniqueness();
    _validate_dock_route_url_uniqueness();
    // _validate_route_name();
}
function _validate_dock_url_uniqueness() {
    const required_atoms = book.get_all_definitions();
    const urls = [];
    for (const [atom_name, atom_def] of Object.entries(required_atoms)) {
        const dock_def = atom_def.dock;
        if (dock_def && typeof dock_def.url === 'string') {
            if (urls.includes(dock_def.url)) {
                throw urn_exc.create_not_initialized(`INVALID_BOOK_DOCK_URL`, `Ivalid dock url value [${dock_def.url}]. Url already in use.` +
                    ` atom_name [${atom_name}]`);
            }
            urls.push(dock_def.url);
        }
    }
}
function _validate_dock_route_url_uniqueness() {
    const required_atoms = book.get_all_definitions();
    for (const [atom_name, atom_def] of Object.entries(required_atoms)) {
        const dock_def = atom_def.dock;
        if (dock_def && dock_def.routes) {
            const route_urls = {};
            for (const [_route_name, route_def] of Object.entries(dock_def.routes)) {
                if (typeof route_def.url === 'string') {
                    if (!route_urls[route_def.method]) {
                        route_urls[route_def.method] = [];
                    }
                    if (route_urls[route_def.method].includes(route_def.url)) {
                        throw urn_exc.create_not_initialized(`INVALID_BOOK_ROUTE_URL`, `Ivalid dock route url value [${route_def.url}]. Url already in use.` +
                            ` atom_name [${atom_name}]`);
                    }
                    route_urls[route_def.method].push(route_def.url);
                }
            }
        }
    }
}
// function _validate_route_name(){
//   const required_atoms = book.get_all_definitions();
//   const invalid_route_names:string[] = _get_default_route_name();
//   for(const [_atom_name, atom_def] of Object.entries(required_atoms)){
//     const dock_def = atom_def.dock;
//     if(dock_def && typeof dock_def.routes === 'object'){
//       for(const [route_name, _route_def] of Object.entries(dock_def.routes)){
//         if(invalid_route_names.includes(route_name)){
//           throw urn_exc.create_not_initialized(
//             `INVALID_BOOK_ROUTE_NAME`,
//             `Ivalid route name [${route_name}].` +
//             ` Route name already in use by the system.`
//           );
//         }
//       }
//     }
//   }
// }
// function _get_default_route_name(){
//   const route_names:string[] = [];
//   for(const route_name in default_routes){
//     route_names.push(route_name);
//   }
//   route_names.push('upload');
//   route_names.push('presigned');
//   return route_names;
// }
function _validate_api_variables() {
    _check_number_values();
}
function _check_number_values() {
    if (defaults_1.api_config.request_auto_limit < 0) {
        throw urn_exc.create_not_initialized(`INVALID_REQUEST_AUTO_LIMIT`, `Config request_auto_limit value cannot be smaller than 0.`);
    }
    if (defaults_1.api_config.service_port < 0) {
        throw urn_exc.create_not_initialized(`INVALID_SERVIE_PORT`, `Config service_port value cannot be smaller than 0.`);
    }
}
//# sourceMappingURL=server.js.map