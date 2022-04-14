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
exports.get_names = exports.has_property = exports.get_properties_definition = exports.get_custom_properties_definition = exports.get_property_definition = exports.get_definition = exports.get_all_definitions = exports.validate_auth_name = exports.validate_name = exports.get_plural = exports.add_definition = exports.add_route_definition = exports.get_dock_definition = exports.get_routes_definition = exports.get_route_definition = exports.get_dock_url = void 0;
// import {urn_util, urn_exception} from 'urn-lib';
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('BOOK_CLIENT', 'Book client methods module');
const client_1 = __importDefault(require("uranio-core/client"));
// import {default_routes, media_routes} from '../routes/client';
function get_dock_url(atom_name) {
    const dock_def = get_dock_definition(atom_name);
    if (!dock_def.url) {
        dock_def.url = `/${get_plural(atom_name)}`;
    }
    if (dock_def.url[0] != '/') {
        dock_def.url = `/${dock_def.url}`;
    }
    return dock_def.url;
}
exports.get_dock_url = get_dock_url;
function get_route_definition(atom_name, route_name) {
    const routes_def = get_routes_definition(atom_name);
    if (!routes_def || !routes_def[route_name]) {
        throw urn_exc.create_invalid_book(`INVALID_ROUTE_NAME`, `Cannot find route name \`${route_name}\`.`);
    }
    return routes_def[route_name];
}
exports.get_route_definition = get_route_definition;
function get_routes_definition(atom_name) {
    const dock_def = get_dock_definition(atom_name);
    if (!dock_def.routes) {
        dock_def.routes = {};
    }
    return dock_def.routes;
}
exports.get_routes_definition = get_routes_definition;
function get_dock_definition(atom_name) {
    const atom_def = get_definition(atom_name);
    const dock_def = atom_def.dock;
    if (!dock_def || !dock_def.url) {
        throw urn_exc.create_invalid_book(`INVALID_DOCK_DEFINITION`, `Atom [${atom_name}] has no or invalid dock definition.`);
    }
    return dock_def;
}
exports.get_dock_definition = get_dock_definition;
function add_route_definition(atom_name, route_name, route_definition) {
    try {
        let routes_definition = get_routes_definition(atom_name);
        routes_definition[route_name] = route_definition;
        // The following is the only way I could find to add the new route
        // as first key in the routes_definition.
        // This is needed because Express otherwise will override the new route
        // with the more general /:id
        // If the new route comes before the general route it will match first.
        for (const [key, value] of Object.entries(routes_definition)) {
            if (route_name === key)
                continue;
            delete routes_definition[key];
            routes_definition[key] = value;
        }
        return routes_definition;
    }
    catch (ex) {
        const err = ex;
        if (err.type === urn_lib_1.urn_exception.ExceptionType.INVALID_BOOK) {
            throw urn_exc.create_invalid_book(`INVALID_DOCK_DEFINITION`, `Cannot add route definition for Atom [${atom_name}].` +
                ` Please make sure Atom definition has property \`dock\` defined and` +
                ` with property \`url\` also defined: {dock: {url: '/[atom_name_plural]'}}`);
        }
        else {
            throw ex;
        }
    }
}
exports.add_route_definition = add_route_definition;
function add_definition(atom_name, atom_definition) {
    return client_1.default.book.add_definition(atom_name, atom_definition);
}
exports.add_definition = add_definition;
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
function get_custom_properties_definition(atom_name) {
    return client_1.default.book.get_custom_properties_definition(atom_name);
}
exports.get_custom_properties_definition = get_custom_properties_definition;
function get_properties_definition(atom_name) {
    return client_1.default.book.get_properties_definition(atom_name);
}
exports.get_properties_definition = get_properties_definition;
function has_property(atom_name, key) {
    return client_1.default.book.has_property(atom_name, key);
}
exports.has_property = has_property;
function get_names() {
    return client_1.default.book.get_names();
}
exports.get_names = get_names;
//# sourceMappingURL=client.js.map