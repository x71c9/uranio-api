/**
 * Lambda util module
 *
 * @packageDocumentation
 */

type QueryParamsObject = {
	[k:string]: any
}

export function map_lambda_query_params(json:QueryParamsObject)
		:QueryParamsObject{
	return parse_param(json);
}

function recursively_check_if_array(parentObj:QueryParamsObject) {
	if(Object.prototype.toString.call(parentObj) != '[object Object]'){
		return parentObj;
	}
	Object.keys(parentObj).map((parentKey) => {
		const childObj = parentObj[parentKey];
		if(Object.prototype.toString.call(childObj) != '[object Object]'){
			return;
		}
		const keys = Object.keys(childObj);
		const every = keys.every((childKey) => {
			return /^(\d+)$/g.test(childKey);
		});
		if(every){
			parentObj[parentKey] = keys.map((key) => {
				return childObj[key];
			});
		}
		recursively_check_if_array(childObj);
	});
	return parentObj;
}

function parse_param(json:QueryParamsObject) {
	Object.keys(json).map((param_name) => {
		// eslint-disable-next-line no-useless-escape
		const segments = param_name.match(/([^\[\]]+)/g);
		if(!segments){
			return;
		}
		let step = json;
		// No nested params found
		if(segments.length <= 1){
			return;
		}
		segments.map((segment, k) => {
			if(k >= segments.length-1) {
				step[segment] = json[param_name];
				return;
			}
			if(!step[segment]){
				step[segment] = {};
			}
			step = step[segment];
		});
		delete json[param_name];
	});
	return recursively_check_if_array(json);
}

