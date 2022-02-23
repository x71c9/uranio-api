"use strict";
/**
 * Generate module
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.init = exports.save_schema = exports.schema_and_save = exports.schema = exports.process_params = void 0;
const uranio_core_1 = __importDefault(require("uranio-core"));
const urn_lib_1 = require("urn-lib");
const book = __importStar(require("../book/server"));
const client_1 = require("../routes/client");
exports.process_params = {
    urn_command: `schema`,
    urn_base_schema: `./.uranio/generate/base/schema.d.ts`,
    urn_output_dir: `.`
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
function _generate_uranio_schema_text(core_schema) {
    const txt = _generate_api_schema_text();
    const split_text = '\texport {};/** --uranio-generate-end */';
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
    return txt;
}
function _generate_route_query_param(atom_book) {
    let text = '';
    text += _generate_route_default_query_param();
    text += _generate_route_custom_query_param(atom_book);
    text += `\texport type RouteQueryParam<A extends AtomName, `;
    text += `R extends RouteName<A>> =\n`;
    text += `\t\tR extends RouteDefaultName ? DefaultRouteQueryParam<R> :\n`;
    text += `\t\tR extends RouteCustomName<A> ?\n`;
    text += `\t\tCustomRouteQueryParam<A,R> extends string ? CustomRouteQueryParam<A,R> :\n`;
    text += `\t\tnever :\n`;
    text += `\t\tnever\n`;
    text += `\n`;
    return text;
}
function _generate_route_default_query_param() {
    let text = '';
    text += `\ttype DefaultRouteQueryParam<R extends RouteDefaultName> =\n`;
    for (const [key, value] of Object.entries(client_1.default_routes)) {
        const route_def = value;
        if (!route_def.query) {
            text += `\t\tR extends '${key}' ? never :\n`;
        }
        else {
            const params_union = route_def.query.map((v) => `'${v}'`).join(' | ');
            text += `\t\tR extends '${key}' ? ${params_union} :\n`;
        }
    }
    text += `\t\tnever\n`;
    text += `\n`;
    return text;
}
function _generate_route_url(atom_book) {
    let text = '';
    text += _generate_route_default_url();
    text += _generate_route_custom_url(atom_book);
    text += `\texport type RouteURL<A extends AtomName, R extends RouteName<A>> =\n`;
    text += `\t\tR extends RouteCustomName<A> ? CustomRouteURL<A,R> :\n`;
    text += `\t\tR extends RouteName<A> ? DefaultRouteURL<A,R> :\n`;
    text += `\t\tnever\n`;
    text += `\n`;
    return text;
}
function _generate_route_default_url() {
    let text = '';
    text += `\ttype DefaultRouteURL<A extends AtomName, R extends RouteName<A>> =\n`;
    for (const [key, val] of Object.entries(client_1.default_routes)) {
        text += `\t\tR extends '${key}' ? '${val.url}' :\n`;
    }
    text += `\t\tnever\n`;
    text += `\n`;
    return text;
}
function _generate_route_name(atom_book) {
    let text = '';
    text += _generate_route_default_name();
    text += _generate_route_custom_name(atom_book);
    text += `\texport type RouteName<A extends AtomName> =\n`;
    text += `\t\tRouteCustomName<A> | RouteDefaultName;\n\n`;
    return text;
}
function _generate_route_default_name() {
    const default_route_keys = Object.keys(client_1.default_routes);
    let text = '';
    text += `\ttype RouteDefaultName = `;
    text += default_route_keys.map((k) => `'${k}'`).join(' | ');
    text += `\n\n`;
    return text;
}
function _generate_route_custom_name(atom_book) {
    let text = '';
    text += `\ttype RouteCustomName<A extends AtomName> =\n`;
    for (const [atom_name, atom_def] of Object.entries(atom_book)) {
        text += `\t\tA extends '${atom_name}' ? ${_route_custom_name(atom_def)} :\n`;
    }
    text += `\tnever\n\n`;
    return text;
}
function _generate_route_custom_url(atom_book) {
    let text = '';
    text += `\ttype CustomRouteURL<A extends AtomName, R extends RouteCustomName<A>> =\n`;
    for (const [atom_name, atom_def] of Object.entries(atom_book)) {
        if (!atom_def.dock || !atom_def.dock.routes) {
            text += `\t\tA extends '${atom_name}' ? never :\n`;
        }
        else {
            text += `\t\tA extends '${atom_name}' ?\n`;
            for (const [route_name, route_def] of Object.entries(atom_def.dock.routes)) {
                text += `\t\t\tR extends '${route_name}' ? '${route_def.url}' :\n`;
            }
            text += `\t\t\tnever :\n`;
        }
    }
    text += `\tnever\n\n`;
    return text;
}
function _generate_route_custom_query_param(atom_book) {
    let text = '';
    text += `\ttype CustomRouteQueryParam<A extends AtomName, R extends RouteCustomName<A>> =\n`;
    for (const [atom_name, atom_def] of Object.entries(atom_book)) {
        if (!atom_def.dock || !atom_def.dock.routes) {
            text += `\t\tA extends '${atom_name}' ? never :\n`;
        }
        else {
            text += `\t\tA extends '${atom_name}' ?\n`;
            for (const [route_name, route_def] of Object.entries(atom_def.dock.routes)) {
                if (!route_def.query || !Array.isArray(route_def.query)) {
                    text += `\t\t\tR extends '${route_name}' ? never :\n`;
                }
                else {
                    const joined_value = route_def.query.map((v) => `'${v}'`).join(' | ');
                    text += `\t\t\tR extends '${route_name}' ? ${joined_value} :\n`;
                }
            }
            text += `\t\t\tnever :\n`;
        }
    }
    text += `\tnever\n\n`;
    return text;
}
function _route_custom_name(atom_def) {
    if (!atom_def.dock || !atom_def.dock.routes) {
        return 'never';
    }
    const route_names = Object.keys(atom_def.dock.routes).map((k) => `'${k}'`);
    return route_names.join(' | ');
}
//# sourceMappingURL=generate.js.map