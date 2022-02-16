"use strict";
/**
 * Register module for URANIO Api
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
// import core from 'uranio-core';
// import * as book from './book/index';
const index_1 = require("./reg/index");
const atoms_1 = require("./atoms");
for (const [atom_name, atom_def] of Object.entries(atoms_1.atom_book)) {
    (0, index_1.register)(atom_def, atom_name);
}
// const dock_def1 = book.get_all_property_definitions('media');
// const dock_def2 = book.get_custom_property_definitions('media');
// const dock_def2 = book.get_property_definition('user');
// // console.log(dock_def1);
// console.log(dock_def2);
//# sourceMappingURL=register.js.map