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
const client_1 = __importDefault(require("uranio-core/client"));
const client_2 = require("../routes/client");
function atom(atom_definition, atom_name) {
    if (atom_definition.dock && atom_definition.dock.url) {
        if (!atom_definition.dock.routes) {
            atom_definition.dock.routes = {};
        }
        atom_definition.dock.routes = {
            ...atom_definition.dock.routes,
            ...client_2.default_routes
        };
    }
    return client_1.default.register.atom(atom_definition, atom_name);
}
exports.atom = atom;
//# sourceMappingURL=atom_cln.js.map