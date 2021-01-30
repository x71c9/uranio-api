/**
 * Index module
 *
 * @packageDocumentation
 */

import urn_core from 'urn-core';

import {core_config, web_config} from './config';

urn_core.init(core_config);

import {service} from './express/';

service.listen(web_config.ws_port, () => {
	
	console.log(`Listening on port ${web_config.ws_port}...`)
	
});

