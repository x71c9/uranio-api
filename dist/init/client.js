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
const atoms_1 = require("../atoms");
const conf = __importStar(require("../conf/client"));
const log = __importStar(require("../log/client"));
const book = __importStar(require("../book/client"));
const client_2 = require("../routes/client");
const atoms_2 = require("../atoms");
function init(config) {
    log.init(urn_lib_1.urn_log.defaults);
    client_1.default.init(config);
    _add_default_routes();
    _register_required_atoms();
    if (!config) {
        conf.set_from_env(defaults_1.api_client_config);
    }
    else {
        conf.set(defaults_1.api_client_config, config);
    }
    if (config && typeof config.log_level === 'number') {
        urn_lib_1.urn_log.defaults.log_level = config.log_level;
    }
    conf.set_initialize(true);
}
exports.init = init;
function _add_default_routes() {
    const core_atom_book = book.get_all_definitions();
    for (const [atom_name, atom_def] of Object.entries(core_atom_book)) {
        if (atom_name === 'media') {
            atom_def.dock.routes = {
                ...client_2.default_routes,
                ...client_2.media_routes
            };
        }
        else if (atoms_2.default_atom_names.includes(atom_name)) {
            atom_def.dock.routes = client_2.default_routes;
        }
        register.atom(atom_def, atom_name);
    }
}
function _register_required_atoms() {
    for (const [atom_name, atom_def] of Object.entries(atoms_1.atom_book)) {
        if (atom_name === 'media') {
            atom_def.dock.routes = {
                ...client_2.default_routes,
                ...client_2.media_routes
            };
        }
        else {
            atom_def.dock.routes = client_2.default_routes;
        }
        register.atom(atom_def, atom_name);
    }
}
//# sourceMappingURL=client.js.map