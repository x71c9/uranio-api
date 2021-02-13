/**
 * Web book types module
 *
 * @packageDocumentation
 */

import urn_core from 'urn_core';

export * from 'urn_core/types';

export type Book = urn_core.types.Book;

export namespace Book {
	
	export type Definition = urn_core.types.Book.Definition & {
		api: Definition.Api
	}
	
	export namespace Definition {
		
		export type Api = {
			url: string
		}
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		export import Security = urn_core.types.Book.Definition.Security;
		
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		export import Properties = urn_core.types.Book.Definition.Properties;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		export import Property = urn_core.types.Book.Definition.Property;
		
	}
	
}

import {FullConfiguration as CoreFullConfiguration} from 'urn_core/types';

type RequiredConfigParams = {
	web_required_param: string
}

type OptionalConfigParam = {
	web_optional_param: string
}

export type Configuration =
	CoreFullConfiguration &
	RequiredConfigParams &
	Partial<OptionalConfigParam>;

export type FullConfiguration =
	CoreFullConfiguration &
	RequiredConfigParams &
	OptionalConfigParam;
