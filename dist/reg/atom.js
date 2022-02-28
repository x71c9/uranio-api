"use strict";
/**
 * Register module
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
    if (atom_definition.dock && atom_definition.dock.url) {
        if (!atom_definition.dock.routes) {
            atom_definition.dock.routes = {};
        }
        const default_routes = (0, calls_1.return_default_routes)('superuser');
        atom_definition.dock.routes = {
            ...atom_definition.dock.routes,
            ...default_routes
        };
    }
    return uranio_core_1.default.register.atom(atom_definition, atom_name);
}
exports.atom = atom;
//# sourceMappingURL=atom.js.map