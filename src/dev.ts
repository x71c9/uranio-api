/**
 * Api dev module
 *
 * @packageDocumentation
 */

import uranio from './server';
uranio.init();

const service = uranio.service.create();
service.listen(async () => {
});

