"use strict";
/**
 * Validate Route request module
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.empty = exports.only_valid_param_keys = exports.only_valid_query_keys = exports.process_request_query = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init(`VALIDATE_REQUEST`, `Validate request module`);
function process_request_query(query) {
    if (typeof query === 'undefined') {
        return {};
    }
    if (!Array.isArray(query) && typeof query === 'object') {
        return query;
    }
    throw urn_exc.create_invalid_request(`INVALID_QUERY_PARAM`, `Invalid query`);
}
exports.process_request_query = process_request_query;
function only_valid_query_keys(query, valid_query_keys) {
    if (query && typeof query === 'object') {
        for (const [k] of Object.entries(query)) {
            if (!valid_query_keys.includes(k)) {
                const err_msg = `Invalid request query parameters \`${k}\``;
                throw urn_exc.create_invalid_request(`INVALID_QUERY`, err_msg);
            }
        }
    }
}
exports.only_valid_query_keys = only_valid_query_keys;
function only_valid_param_keys(params, valid_params_keys) {
    if (params && typeof params === 'object') {
        for (const [k] of Object.entries(params)) {
            if (!valid_params_keys.includes(k)) {
                const err_msg = `Invalid parameters \`${k}\``;
                throw urn_exc.create_invalid_request(`INVALID_PARAMETERS`, err_msg);
            }
        }
    }
}
exports.only_valid_param_keys = only_valid_param_keys;
function empty(p, param_name) {
    if (!p) {
        return true;
    }
    if (p && typeof p === 'object' && Object.keys(p).length === 0) {
        return true;
    }
    let err_msg = `Invalid request.`;
    err_msg += ` \`${param_name}\``;
    err_msg += ` should be empty.`;
    throw urn_exc.create_invalid_request(`INVALID_PARAM`, err_msg);
}
exports.empty = empty;
//# sourceMappingURL=validate.js.map