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
exports.register = void 0;
const uranio_core_1 = __importDefault(require("uranio-core"));
function register(atom_definition, atom_name) {
    return uranio_core_1.default.register(atom_definition, atom_name);
}
exports.register = register;
//# sourceMappingURL=register.js.map