"use strict";
/**
 * Init module
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('INIT_API_MODULE', `Api init module`);
const uranio_core_1 = __importDefault(require("uranio-core"));
const defaults_1 = require("../conf/defaults");
const register = __importStar(require("../reg/server"));
const atoms_1 = require("../atoms");
const conf = __importStar(require("../conf/server"));
const book = __importStar(require("../book/server"));
const log = __importStar(require("../log/server"));
const calls_1 = require("../routes/calls");
const atoms_2 = require("../atoms");
function init(config) {
    log.init(urn_lib_1.urn_log.defaults);
    uranio_core_1.default.init(config);
    _add_default_routes();
    _register_required_atoms();
    if (typeof config === 'undefined') {
        uranio_core_1.default.conf.set_from_env(defaults_1.api_config);
    }
    else {
        uranio_core_1.default.conf.set(defaults_1.api_config, config);
    }
    _validate_api_variables();
    _validate_api_book();
    if (config && typeof config.log_level === 'number') {
        urn_lib_1.urn_log.defaults.log_level = config.log_level;
    }
    conf.set_initialize(true);
}
exports.init = init;
function _add_default_routes() {
    const core_atom_book = book.get_all_definitions();
    for (const [atom_name, atom_def] of Object.entries(core_atom_book)) {
        if (atoms_2.default_atom_names.includes(atom_name)) {
            if (atom_def.dock) {
                atom_def.dock.routes = (0, calls_1.return_default_routes)(atom_name);
            }
        }
    }
}
function _register_required_atoms() {
    for (const [atom_name, atom_def] of Object.entries(atoms_1.atom_book)) {
        atom_def.dock.routes = (0, calls_1.return_default_routes)(atom_name);
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
    const atom_book = book.get_all_definitions();
    const urls = [];
    for (const [atom_name, atom_def] of Object.entries(atom_book)) {
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
    const atom_book = book.get_all_definitions();
    for (const [atom_name, atom_def] of Object.entries(atom_book)) {
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
//   const atom_book = book.get_all_definitions();
//   const invalid_route_names:string[] = _get_default_route_name();
//   for(const [_atom_name, atom_def] of Object.entries(atom_book)){
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