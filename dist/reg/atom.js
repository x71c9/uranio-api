"use strict";
/**
 * Register module
 *
 * This method registers the atom_defintion in the Book.
 * Before register with the core method, it appends the
 * default routes if the parameter dock.url is defined.
 *
 * It uses `return_default_routes('_superuser')` as default routes.
 * `_superuser` it is the same as any other Atoms.
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atom = void 0;
const uranio_core_1 = __importDefault(require("uranio-core"));
const calls_1 = require("../routes/calls");
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
    const default_routes = (0, calls_1.return_default_routes)(atom_name);
    atom_definition.dock.routes = {
        ...atom_definition.dock.routes,
        ...default_routes
    };
    return uranio_core_1.default.register.atom(atom_definition, atom_name);
}
exports.atom = atom;
//# sourceMappingURL=atom.js.map