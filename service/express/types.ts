/**
 * Express type module
 *
 * @packageDocumentation
 */

import QueryString from 'qs';

export type ExpressQueryParam =
	string |
	QueryString.ParsedQs |
	string[] |
	QueryString.ParsedQs[] |
	undefined;
