/**
 * Register module for URANIO Api
 *
 * @packageDocumentation
 */

// import core from 'uranio-core';

// import * as book from './book/index';

import {register} from './reg/index';

import {atom_book} from './atoms';

for(const [atom_name, atom_def] of Object.entries(atom_book)){
	register(atom_def as any, atom_name);
}

// const dock_def1 = book.get_all_property_definitions('media');
// const dock_def2 = book.get_custom_property_definitions('media');
// const dock_def2 = book.get_property_definition('user');
// // console.log(dock_def1);
// console.log(dock_def2);
