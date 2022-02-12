/**
 * Register module for URANIO Api
 *
 * @packageDocumentation
 */

import core from 'uranio-core';

import {atom_book} from './base';

for(const [atom_name, atom_def] of Object.entries(atom_book)){
	core.register(atom_def, atom_name);
}
