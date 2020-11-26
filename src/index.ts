/**
 * Index module
 *
 * @packageDocumentation
 */

import urn_core from 'urn-core';

import {get_core_config, get_web_config} from './config';

urn_core.init(get_core_config());

import {service} from './express/';

const web_config = get_web_config();

service.listen(web_config.ws_port, () => {
	console.log(`Listening on port ${web_config.ws_port}...`)
})

