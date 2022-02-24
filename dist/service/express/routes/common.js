"use strict";
/**
 * Express common route module
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
exports.return_uranio_response_to_express = exports.express_request_to_partial_api_request = void 0;
const uranio_core_1 = __importDefault(require("uranio-core"));
const request_1 = require("../../../util/request");
const types = __importStar(require("../../../server/types"));
function express_request_to_partial_api_request(req) {
    let api_request = {
        full_path: req.originalUrl,
        params: req.params,
        query: req.query
    };
    const api_request_paths = (0, request_1.process_request_path)(req.originalUrl);
    if (!api_request_paths.atom_path) {
        return api_request;
    }
    api_request = {
        ...api_request,
        ...api_request_paths
    };
    const atom_name = (0, request_1.get_atom_name_from_atom_path)(api_request_paths.atom_path);
    if (!atom_name) {
        return api_request;
    }
    api_request.atom_name = atom_name;
    switch (req.method.toUpperCase()) {
        case 'GET': {
            api_request.method = types.RouteMethod.GET;
            break;
        }
        case 'POST': {
            api_request.method = types.RouteMethod.POST;
            break;
        }
        case 'DELETE': {
            api_request.method = types.RouteMethod.DELETE;
            break;
        }
        default: {
            return api_request;
        }
    }
    const route_name = (0, request_1.get_route_name)(atom_name, api_request_paths.route_path, api_request.method);
    if (!route_name) {
        return api_request;
    }
    api_request.route_name = route_name;
    const is_auth = (0, request_1.is_auth_request)(atom_name, api_request_paths.atom_path);
    api_request.is_auth = is_auth;
    const auth_action = (0, request_1.get_auth_action)(atom_name, route_name);
    if (!auth_action) {
        return api_request;
    }
    api_request.auth_action = auth_action;
    if (is_auth) {
        api_request.auth_action = uranio_core_1.default.types.AuthAction.READ;
        api_request.route_name = 'auth';
    }
    if (req.body) {
        api_request.body = req.body;
    }
    if (req.files && typeof req.files.file === 'object') {
        const req_file = req.files.file;
        api_request.file = {
            name: req_file.name,
            data: req_file.data,
            size: req_file.size,
            mime_type: req_file.mimetype
        };
    }
    if (req.headers) {
        const headers = {};
        for (const [name, value] of Object.entries(req.headers)) {
            headers[name] = (Array.isArray(value)) ? JSON.stringify(value) : value;
        }
        api_request.headers = headers;
    }
    if (req.ip) {
        api_request.ip = req.ip;
    }
    return api_request;
}
exports.express_request_to_partial_api_request = express_request_to_partial_api_request;
function _set_and_remove_headers(urn_res, res) {
    if (urn_res.payload && urn_res.payload.headers) {
        const headers = urn_res.payload.headers;
        for (const [name, value] of Object.entries(headers)) {
            res.setHeader(name, value);
        }
        delete urn_res.payload.headers;
    }
    if (urn_res.payload && urn_res.payload.multi_value_headers) {
        const multi_value_headers = urn_res.payload.multi_value_headers;
        for (const [name, value] of Object.entries(multi_value_headers)) {
            res.setHeader(name, value);
        }
        delete urn_res.payload.multi_value_headers;
    }
    return res;
}
function return_uranio_response_to_express(urn_res, res) {
    res = _set_and_remove_headers(urn_res, res);
    return res.status(urn_res.status).send(urn_res);
}
exports.return_uranio_response_to_express = return_uranio_response_to_express;
//# sourceMappingURL=common.js.map