/**
 * Web run module
 *
 * @packageDocumentation
 */

import urn_web from 'urn_web';

const express_service = urn_web.service.express.create();

express_service.listen(3000, () => {
	console.log(`Listening on port 3000...`);
});
