"use strict";
/**
 * Module for Client Book Methods
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_names = exports.has_property = exports.get_full_properties_definition = exports.get_custom_property_definitions = exports.get_property_definition = exports.get_definition = exports.get_all_definitions = exports.validate_auth_name = exports.validate_name = exports.get_plural = exports.get_dock_definition = exports.get_routes_definition_with_defaults = exports.get_routes_definition = exports.get_route_def = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('BOOK_CLIENT', 'Book client methods module');
// import * as atom from './atom/client';
// export {atom};
// import * as dock from './dock/client';
// export {dock};
const client_1 = __importDefault(require("uranio-core/client"));
const client_2 = require("../routes/client");
function get_route_def(atom_name, route_name) {
    const routes_def = get_routes_definition_with_defaults(atom_name);
    if (!routes_def || !routes_def[route_name]) {
        throw urn_exc.create_invalid_book(`INVALID_ROUTE_NAME`, `Cannot find route name \`${route_name}\`.`);
    }
    return routes_def[route_name];
}
exports.get_route_def = get_route_def;
function get_routes_definition(atom_name) {
    const dock_def = get_dock_definition(atom_name);
    if (!dock_def.routes) {
        dock_def.routes = {};
    }
    return dock_def.routes;
}
exports.get_routes_definition = get_routes_definition;
function get_routes_definition_with_defaults(atom_name) {
    const dock_def = get_dock_definition(atom_name);
    if (!dock_def.routes) {
        dock_def.routes = {};
    }
    for (const [route_name, route_def] of Object.entries(client_2.default_routes)) {
        dock_def.routes[route_name] = route_def;
    }
    return dock_def.routes;
}
exports.get_routes_definition_with_defaults = get_routes_definition_with_defaults;
function get_dock_definition(atom_name) {
    const atom_def = get_definition(atom_name);
    const dock_def = atom_def.dock;
    if (!dock_def || !dock_def.url) {
        return {
            url: `/${get_plural(atom_name)}`
        };
    }
    return dock_def;
}
exports.get_dock_definition = get_dock_definition;
function get_plural(atom_name) {
    return client_1.default.book.get_plural(atom_name);
}
exports.get_plural = get_plural;
function validate_name(atom_name) {
    return client_1.default.book.validate_name(atom_name);
}
exports.validate_name = validate_name;
function validate_auth_name(auth_name) {
    return client_1.default.book.validate_auth_name(auth_name);
}
exports.validate_auth_name = validate_auth_name;
function get_all_definitions() {
    return client_1.default.book.get_all_definitions();
}
exports.get_all_definitions = get_all_definitions;
function get_definition(atom_name) {
    return client_1.default.book.get_definition(atom_name);
}
exports.get_definition = get_definition;
function get_property_definition(atom_name, property_name) {
    return client_1.default.book.get_property_definition(atom_name, property_name);
}
exports.get_property_definition = get_property_definition;
function get_custom_property_definitions(atom_name) {
    return client_1.default.book.get_custom_property_definitions(atom_name);
}
exports.get_custom_property_definitions = get_custom_property_definitions;
function get_full_properties_definition(atom_name) {
    return client_1.default.book.get_full_properties_definition(atom_name);
}
exports.get_full_properties_definition = get_full_properties_definition;
function has_property(atom_name, key) {
    return client_1.default.book.has_property(atom_name, key);
}
exports.has_property = has_property;
function get_names() {
    return client_1.default.book.get_names();
}
exports.get_names = get_names;
//# sourceMappingURL=client.js.map