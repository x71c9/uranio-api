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
const client_1 = __importDefault(require("uranio-core/client"));
const defaults_1 = require("../client/defaults");
const register = __importStar(require("../reg/client"));
const required = __importStar(require("../req/client"));
const conf = __importStar(require("../conf/client"));
const log = __importStar(require("../log/client"));
// import * as book from '../book/client';
// import {default_routes, media_routes} from '../routes/client';
// import {default_atom_names} from '../req/atoms';
function init(config, register_required = true) {
    log.init(urn_lib_1.urn_log.defaults);
    client_1.default.init(config, false);
    if (!config) {
        conf.set_from_env(defaults_1.api_client_config);
    }
    else {
        conf.set(defaults_1.api_client_config, config);
    }
    if (register_required) {
        _register_required_atoms();
    }
    conf.set_initialize(true);
    urn_lib_1.urn_log.defaults.log_level = conf.get(`log_level`);
}
exports.init = init;
// function _add_default_routes(){
//   const core_atom_book = book.get_all_definitions();
//   for(const [atom_name, atom_def] of Object.entries(core_atom_book)){
//     if(atom_name === 'media'){
//       (atom_def.dock as any).routes = {
//         ...default_routes,
//         ...media_routes
//       };
//     }else if(default_atom_names.includes(atom_name)){
//       (atom_def.dock as any).routes = default_routes;
//     }
//     register.atom(atom_def as any, atom_name as any);
//   }
// }
function _register_required_atoms() {
    const required_atoms = required.get();
    for (const [atom_name, atom_def] of Object.entries(required_atoms)) {
        // if(atom_name === 'media'){
        //   (atom_def.dock as any).routes = {
        //     ...default_routes,
        //     ...media_routes
        //   };
        // }else{
        //   (atom_def.dock as any).routes = default_routes;
        // }
        register.atom(atom_def, atom_name);
    }
}
//# sourceMappingURL=client.js.map