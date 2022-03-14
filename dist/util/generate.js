"use strict";
/**
 * Generate module
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.save_client_config = exports.client_config_and_save = exports.client_config = exports.init = exports.save_schema = exports.schema_and_save = exports.schema = exports.process_params = void 0;
const uranio_core_1 = __importDefault(require("uranio-core"));
const urn_lib_1 = require("urn-lib");
const book = __importStar(require("../book/server"));
const client_1 = require("../routes/client");
const conf = __importStar(require("../conf/server"));
const required_server_config_client = [
    'service_protocol',
    'service_domain',
    'service_port',
    'dev_service_protocol',
    'dev_service_domain',
    'dev_service_port',
];
exports.process_params = {
    urn_command: `schema`
};
function schema() {
    urn_lib_1.urn_log.debug('Started generating uranio api schema...');
    init();
    const core_schema = uranio_core_1.default.util.generate.schema();
    const text = _generate_uranio_schema_text(core_schema);
    urn_lib_1.urn_log.debug(`API Schema generated.`);
    return text;
}
exports.schema = schema;
function schema_and_save() {
    const text = schema();
    save_schema(text);
    urn_lib_1.urn_log.debug(`Schema generated and saved.`);
}
exports.schema_and_save = schema_and_save;
function save_schema(text) {
    return uranio_core_1.default.util.generate.save_schema(text);
}
exports.save_schema = save_schema;
function init() {
    uranio_core_1.default.util.generate.init();
    exports.process_params = uranio_core_1.default.util.generate.process_params;
}
exports.init = init;
function client_config(client_default) {
    urn_lib_1.urn_log.debug('Started generating uranio api client config...');
    init();
    const all_server_conf = conf.get_all();
    for (const reqkey of required_server_config_client) {
        client_config[`__server_${reqkey}`] = all_server_conf[reqkey];
    }
    const text = uranio_core_1.default.util.generate.client_config(client_default);
    urn_lib_1.urn_log.debug(`Api client config generated.`);
    return text;
}
exports.client_config = client_config;
function client_config_and_save(client_default) {
    const text = client_config(client_default);
    save_client_config(text);
    urn_lib_1.urn_log.debug(`Api Client config generated and saved.`);
}
exports.client_config_and_save = client_config_and_save;
function save_client_config(text) {
    uranio_core_1.default.util.generate.save_client_config(text);
}
exports.save_client_config = save_client_config;
function _generate_uranio_schema_text(core_schema) {
    const txt = _generate_api_schema_text();
    const split_text = 'export {};/** --uranio-generate-end */';
    const data_splitted = core_schema.split(split_text);
    let new_data = '';
    new_data += data_splitted[0];
    new_data += txt;
    +'\n\n\t';
    new_data += split_text;
    new_data += data_splitted[1];
    return new_data;
}
function _generate_api_schema_text() {
    const atom_book = book.get_all_definitions();
    let txt = '';
    txt += _generate_route_name(atom_book);
    txt += _generate_route_url(atom_book);
    txt += _generate_route_query_param(atom_book);
    txt += `\n`;
    txt += `import {urn_response} from 'urn-lib';\n`;
    txt += _generate_call_response(atom_book);
    // txt += _generate_api_response(atom_book);
    txt += _generate_api_response();
    return txt;
}
function _generate_call_response(atom_book) {
    return _return_generic_response(atom_book, 'CallResponse', false);
}
function _generate_api_response() {
    // function _generate_api_response(atom_book:types.Book){
    // return _return_generic_response(atom_book, 'ApiResponse', true);
    let text = '';
    text += `\nexport declare type ApiResponse<A extends AtomName, R extends RouteName<A>, D extends Depth = 0> = urn_response.General<CallResponse<A,R,D>>`;
    text += `\n`;
    text += `\n`;
    return text;
}
function _return_generic_response(atom_book, type_name, response_wrapper = false) {
    let text = '';
    text += `\nexport declare type ${type_name}<A extends AtomName, R extends RouteName<A>, D extends Depth = 0> =\n`;
    for (const [atom_name, atom_def] of Object.entries(atom_book)) {
        text += `\tA extends '${atom_name}' ?\n`;
        if (!atom_def.dock || !atom_def.dock.routes) {
            text += `\t\tnever :\n`;
        }
        else {
            const routes = atom_def.dock.routes;
            for (const [route_name, route_def] of Object.entries(routes)) {
                text += `\t\tR extends '${route_name}' ? ${_return_response_return(route_def.return, response_wrapper)} :\n`;
            }
            text += `\t\tnever :\n`;
        }
    }
    text += `\tnever\n`;
    text += `\n`;
    return text;
}
function _return_response_return(return_type, response_wrapper = false) {
    if (response_wrapper === false) {
        return return_type;
    }
    return `urn_response.General<${return_type}, any>`;
}
function _generate_route_query_param(atom_book) {
    let text = '';
    // text += _generate_route_default_query_param();
    text += _generate_route_custom_query_param(atom_book);
    // text += `export declare type RouteQueryParam<A extends AtomName, `;
    // text += `R extends RouteName<A>> =\n`;
    // text += `\tR extends RouteDefaultName ? DefaultRouteQueryParam<R> :\n`;
    // text += `\tR extends RouteCustomName<A> ?\n`;
    // text += `\tCustomRouteQueryParam<A,R> extends string ? CustomRouteQueryParam<A,R> :\n`;
    // text += `\tnever :\n`;
    // text += `\tnever\n`;
    text += `\n`;
    return text;
}
// function _generate_route_default_query_param(){
//   let text = '';
//   text += `declare type DefaultRouteQueryParam<R extends RouteDefaultName> =\n`;
//   for(const [key, value] of Object.entries(default_routes)){
//     const route_def = value as types.Book.Definition.Dock.Routes.Route<'superuser', 'find'>;
//     if(!route_def.query){
//       text += `\tR extends '${key}' ? never :\n`;
//     }else{
//       const params_union = route_def.query.map((v) => `'${v}'`).join(' | ');
//       text += `\tR extends '${key}' ? ${params_union} :\n`;
//     }
//   }
//   text += `\tnever\n`;
//   text += `\n`;
//   return text;
// }
function _generate_route_url(atom_book) {
    let text = '';
    // text += _generate_route_default_url();
    text += _generate_route_custom_url(atom_book);
    // text += `export declare type RouteURL<A extends AtomName, R extends RouteName<A>> =\n`;
    // text += `\tR extends RouteCustomName<A> ? CustomRouteURL<A,R> :\n`;
    // text += `\tR extends RouteName<A> ? DefaultRouteURL<A,R> :\n`;
    // text += `\tnever\n`;
    text += `\n`;
    return text;
}
// function _generate_route_default_url(){
//   let text = '';
//   text += `declare type DefaultRouteURL<A extends AtomName, R extends RouteName<A>> =\n`;
//   for(const [key, val] of Object.entries(default_routes)){
//     text += `\tR extends '${key}' ? '${val.url}' :\n`;
//   }
//   text += `\tnever\n`;
//   text += `\n`;
//   return text;
// }
function _generate_route_name(atom_book) {
    let text = '';
    text += _generate_route_default_name();
    text += _generate_route_custom_name(atom_book);
    text += `export declare type RouteName<A extends AtomName> =\n`;
    text += `\tRouteCustomName<A> | RouteDefaultName;\n\n`;
    return text;
}
function _generate_route_default_name() {
    const default_route_keys = Object.keys(client_1.default_routes);
    let text = '';
    text += `declare type RouteDefaultName = `;
    text += default_route_keys.map((k) => `'${k}'`).join(' | ');
    text += `\n\n`;
    return text;
}
function _generate_route_custom_name(atom_book) {
    let text = '';
    text += `declare type RouteCustomName<A extends AtomName> =\n`;
    // text += `export declare type RouteName<A extends AtomName> =\n`;
    for (const [atom_name, atom_def] of Object.entries(atom_book)) {
        const custom_routes = _route_custom_name(atom_def);
        const routes = (custom_routes !== '') ? custom_routes : 'never';
        text += `\tA extends '${atom_name}' ? ${routes} :\n`;
    }
    text += `\tnever\n\n`;
    return text;
}
function _generate_route_custom_url(atom_book) {
    let text = '';
    // text += `declare type CustomRouteURL<A extends AtomName, R extends RouteCustomName<A>> =\n`;
    text += `export declare type RouteURL<A extends AtomName, R extends RouteName<A>> =\n`;
    for (const [atom_name, atom_def] of Object.entries(atom_book)) {
        if (!atom_def.dock || !atom_def.dock.routes) {
            text += `\tA extends '${atom_name}' ? never :\n`;
        }
        else {
            text += `\tA extends '${atom_name}' ?\n`;
            for (const [route_name, route_def] of Object.entries(atom_def.dock.routes)) {
                text += `\t\tR extends '${route_name}' ? '${route_def.url}' :\n`;
            }
            text += `\t\tnever :\n`;
        }
    }
    text += `never\n\n`;
    return text;
}
function _generate_route_custom_query_param(atom_book) {
    let text = '';
    // text += `declare type CustomRouteQueryParam<A extends AtomName, R extends RouteCustomName<A>> =\n`;
    text += `export declare type RouteQueryParam<A extends AtomName, R extends RouteName<A>> =\n`;
    for (const [atom_name, atom_def] of Object.entries(atom_book)) {
        if (!atom_def.dock || !atom_def.dock.routes) {
            text += `\tA extends '${atom_name}' ? never :\n`;
        }
        else {
            text += `\tA extends '${atom_name}' ?\n`;
            for (const [route_name, route_def] of Object.entries(atom_def.dock.routes)) {
                if (!route_def.query || !Array.isArray(route_def.query)) {
                    text += `\t\tR extends '${route_name}' ? never :\n`;
                }
                else {
                    const joined_value = route_def.query.map((v) => `'${v}'`).join(' | ');
                    text += `\t\tR extends '${route_name}' ? ${joined_value} :\n`;
                }
            }
            text += `\t\tnever :\n`;
        }
    }
    text += `never\n\n`;
    return text;
}
function _route_custom_name(atom_def) {
    if (!atom_def.dock || !atom_def.dock.routes) {
        return 'never';
    }
    const route_array = [];
    for (const [route_name, _route_def] of Object.entries(atom_def.dock.routes)) {
        if (typeof client_1.default_routes[route_name] === 'undefined') {
            route_array.push(`'${route_name}'`);
        }
    }
    return route_array.join(' | ');
}
//# sourceMappingURL=generate.js.map