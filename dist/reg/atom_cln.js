"use strict";
/**
 * Register module
 *
 * This method registers the atom_defintion in the Book.
 * Before register with the core_client method, it appends the
 * default routes if the paramter dock.url is definied.
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atom = void 0;
const client_1 = __importDefault(require("uranio-core/client"));
const client_2 = require("../routes/client");
function atom(atom_definition, atom_name) {
    const plural = atom_definition.plural || `${atom_name}s`;
    if (!atom_definition.dock) {
        atom_definition.dock = {
            url: `/${plural}`,
            routes: {}
        };
    }
    if (!atom_definition.dock.url) {
        atom_definition.dock.url = `/${plural}`;
    }
    if (!atom_definition.dock.routes) {
        atom_definition.dock.routes = {};
    }
    atom_definition.dock.routes = {
        ...atom_definition.dock.routes,
        ...client_2.default_routes
    };
    return client_1.default.register.atom(atom_definition, atom_name);
}
exports.atom = atom;
//# sourceMappingURL=atom_cln.js.map