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
// import path from 'path';
// import caller from 'caller';
// import {urn_log} from 'urn-lib';
const uranio_core_1 = __importDefault(require("uranio-core"));
function register(atom_definition, atom_name) {
    // let final_atom_name = `undefined_atom`;
    // if(atom_name){
    //   final_atom_name = atom_name;
    // }else{
    //   const caller_path = caller();
    //   console.log(caller_path);
    //   const dirname = path.dirname(caller_path);
    //   final_atom_name =
    //     dirname.split('/').slice(-1)[0].replace('.','_').replace('-','_');
    // }
    // urn_log.debug(`Registering atom [${final_atom_name}]...`);
    // book.add_definition(final_atom_name as A, atom_definition);
    // urn_log.debug(`Atom [${final_atom_name}] registered.`);
    // return atom_definition;
    return uranio_core_1.default.register(atom_definition, atom_name);
}
exports.register = register;
//# sourceMappingURL=register.js.map