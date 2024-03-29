"use strict";
/**
 * Route middleware module
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
exports.auth_route_middleware = exports.route_middleware = void 0;
// import jwt from 'jsonwebtoken';
const uranio_utils_1 = require("uranio-utils");
const urn_ret = uranio_utils_1.urn_return.create(uranio_utils_1.urn_log.util.return_injector);
const urn_exc = uranio_utils_1.urn_exception.init('EXPRESS_MDLW', 'Express middlewares');
const uranio_core_1 = __importDefault(require("uranio-core"));
const conf = __importStar(require("../conf/server"));
// import * as env from '../env/server';
const insta = __importStar(require("../nst/server"));
const book = __importStar(require("../book/server"));
const types = __importStar(require("../srv/types"));
// import {return_default_routes} from '../routes/server';
const request_1 = require("../util/request");
const req_validator = __importStar(require("./validate"));
async function route_middleware(api_request) {
    _log_route_request(api_request);
    const auth_reponse = await _authorization(api_request);
    if (auth_reponse) {
        api_request = auth_reponse;
    }
    api_request = _limit(api_request);
    return await _validate_and_call(api_request);
}
exports.route_middleware = route_middleware;
async function auth_route_middleware(api_request, auth_handler) {
    _log_auth_route_request(api_request);
    if (typeof auth_handler !== 'function') {
        throw urn_exc.create(`INVALID_AUTH_HANDLER`, `Missing or invalid auth handler.`);
    }
    return await _auth_validate_and_call(api_request, auth_handler);
}
exports.auth_route_middleware = auth_route_middleware;
async function _authorization(api_request) {
    // const route_def = _get_route_def(api_request);
    const route_def = book.get_route_definition(api_request.atom_name, api_request.route_name);
    if (uranio_core_1.default.bll.auth.is_public_request(api_request.atom_name, route_def.action)) {
        return false;
    }
    const auth_token = _get_auth_token(api_request);
    if (!auth_token) {
        return false;
    }
    try {
        // const decoded = jwt.verify(auth_token, env.get(`jwt_private_key`)) as core.types.Passport;
        // if(!core.bll.auth.is_valid_token(auth_token)){
        // 	throw urn_exc.create_unauthorized(`INVALID_TOKEN`, `Invalid token.`, ex);
        // }
        const decoded = await uranio_core_1.default.bll.auth.decode_token(auth_token);
        api_request.passport = decoded;
        return api_request;
    }
    catch (e) {
        const ex = e;
        throw urn_exc.create_unauthorized(`INVALID_TOKEN`, `Invalid token.`, ex);
    }
}
async function _validate_and_call(api_request) {
    // const route_def = _get_route_def(api_request);
    const route_def = book.get_route_definition(api_request.atom_name, api_request.route_name);
    uranio_utils_1.urn_log.trace(`Router ${route_def.method} [${api_request.atom_name}] ${api_request.full_path}`);
    _validate_route(api_request);
    if (!uranio_utils_1.urn_util.object.has_key(route_def, 'call') || !route_def.call) {
        return urn_ret.return_error(404, `Route call not implemented.`, `ROUTE_CALL_NOT_IMPLEMENTED`, `Route call not implemented.`);
    }
    let call_response = await route_def.call(api_request);
    // call_response.headers = {
    //   'Access-Control-Allow-Origin': 'http://localhost:4444',
    //   // 'Access-Control-Allow-Credentials': true
    // };
    if (uranio_core_1.default.atom.util.is_molecule(api_request.atom_name, call_response)
        || uranio_core_1.default.atom.util.is_atom(api_request.atom_name, call_response)) {
        call_response = uranio_core_1.default.atom.util.hide_hidden_properties(api_request.atom_name, call_response);
    }
    let urn_response = urn_ret.return_success('Success', call_response);
    urn_response = await _assign_regenerated_token(api_request, urn_response);
    return urn_response;
}
// "Set-Cookie": [`urn-auth-token=${auth_token}; Path=/; SameSite=Strict; HttpOnly; Secure`]
// "Set-Cookie": [`urn-auth-token=${auth_token}; Path=/; SameSite=Strict; HttpOnly`]
// "Set-Cookie": [`urn-auth-token=${auth_token}; Path=/; Domain=localhost; HttpOnly`]
// "Set-Cookie": [`urn-auth-token=${auth_token}; Path=/; Domain=192.168.1.69; HttpOnly`]
function _set_payload_multi_value_header_httponly_cookie(urn_response, token) {
    if (!urn_response.meta) {
        urn_response.meta = {};
    }
    if (!urn_response.meta.multi_value_headers) {
        urn_response.meta.multi_value_headers = {};
    }
    urn_response.meta.multi_value_headers["Set-Cookie"] = [
        `urn-auth-token=${token}; HttpOnly; Path=/; Max-Age=${conf.get('auth_cookie_expire_seconds')}`
    ];
    return urn_response;
}
function _set_payload_header_token(urn_response, token) {
    if (!urn_response.meta) {
        urn_response.meta = {};
    }
    if (!urn_response.meta.headers) {
        urn_response.meta.headers = {};
    }
    urn_response.meta.headers['urn-auth-token'] = token;
    return urn_response;
}
async function _assign_regenerated_token(api_request, urn_response) {
    if (!api_request.passport) {
        return urn_response;
    }
    const auth_bll = uranio_core_1.default.bll.auth.create(api_request.passport.auth_atom_name);
    const regenerated_token = auth_bll.regenerate_token(api_request.passport);
    urn_response = _set_payload_header_token(urn_response, regenerated_token);
    urn_response = _set_payload_multi_value_header_httponly_cookie(urn_response, regenerated_token);
    return urn_response;
}
async function _auth_validate_and_call(auth_route_request, handler) {
    const dock_def = book.get_dock_definition(auth_route_request.atom_name);
    // if(!dock_def){
    //   throw urn_exc.create_invalid_book(
    //     `INVALID_DOCK_DEF`,
    //     `Cannot auth validate and call. Invalid dock def.`
    //   );
    // }
    uranio_utils_1.urn_log.trace(`Router Auth ${dock_def.url} [${auth_route_request.atom_name}]`);
    _auth_validate(auth_route_request);
    const auth_token = await handler(auth_route_request);
    let urn_response = urn_ret.return_success('Success', { token: auth_token });
    urn_response = _set_payload_header_token(urn_response, auth_token);
    urn_response = _set_payload_multi_value_header_httponly_cookie(urn_response, auth_token);
    return urn_response;
}
function _auth_validate(api_request) {
    uranio_utils_1.urn_log.trace(`Validate Auth Route [${api_request.atom_name}]`);
    req_validator.empty(api_request.params, 'params');
    req_validator.empty(api_request.query, 'query');
}
function _validate_route(api_request) {
    const route_def = book.get_route_definition(api_request.atom_name, api_request.route_name);
    uranio_utils_1.urn_log.trace(`Validate Route ${route_def.url} [${api_request.atom_name}]`);
    if (route_def.method !== types.RouteMethod.POST) {
        req_validator.empty(api_request.body, 'body');
        req_validator.empty(api_request.file, 'file');
    }
    if (route_def.url.indexOf(':') !== -1) {
        const param_names = [];
        const folds = route_def.url.split('/');
        for (let i = 0; i < folds.length; i++) {
            const splitted = folds[i].split(':');
            if (splitted.length === 2) {
                param_names.push(splitted[1]);
            }
        }
        req_validator.only_valid_param_keys(api_request.params, param_names);
    }
    else {
        req_validator.empty(api_request.params, 'params');
    }
    if (route_def.query) {
        req_validator.only_valid_query_keys(api_request.query, route_def.query);
        // if(Array.isArray(route_def.query)){
        //   for(let i = 0; i < route_def.query.length; i++){
        //     api_request.query[route_def.query[i]! as types.RouteQueryParam<A,R>] =
        //       req_validator.process_request_query<A>(
        //         api_request.query[route_def.query[i]! as types.RouteQueryParam<A,R>]
        //       ) as any;
        //   }
        // }
    }
    else {
        req_validator.empty(api_request.query, 'query');
    }
}
function _limit(api_request) {
    var _a;
    const route_def = book.get_route_definition(api_request.atom_name, api_request.route_name);
    if (!Array.isArray(route_def.query) || !route_def.query.includes('options')) {
        return api_request;
    }
    let options = (_a = api_request.query) === null || _a === void 0 ? void 0 : _a.options;
    if (!options) {
        options = {};
    }
    if (!options.limit || options.limit > conf.get(`request_auto_limit`)) {
        options.limit = conf.get(`request_auto_limit`);
    }
    api_request.query.options = options;
    return api_request;
}
// function _get_route_def<A extends schema.AtomName, R extends schema.RouteName<A>, D extends schema.Depth = 0>(
//   api_request:types.Api.Request<A,R,D>
// ):types.Book.Definition.Dock.Routes.Route<A,R,D>{
//   const cloned_atom_dock = {
//     ...book.get_definition(api_request.atom_name).dock
//   };
//   const default_routes = return_default_routes(api_request.atom_name);
//   if(!cloned_atom_dock.routes){
//     cloned_atom_dock.routes = default_routes;
//   }else{
//     cloned_atom_dock.routes = {
//       ...default_routes,
//       ...cloned_atom_dock.routes
//     };
//   }
//   if(!(cloned_atom_dock.routes as any)[api_request.route_name as string]){
//     throw urn_exc.create(`INVALID_ROUTE_NAME`, `Invalid route name.`);
//   }
//   return (cloned_atom_dock.routes as any)[api_request.route_name as string]! as types.Book.Definition.Dock.Routes.Route<A,R,D>;
// }
function _log_route_request(api_request) {
    if (conf.get('default_atoms_request') === false) {
        return;
    }
    const request_shape = (0, request_1.partial_api_request_to_atom_request)(api_request);
    const bll_reqs = insta.get_bll_request();
    bll_reqs.insert_new(request_shape).catch((ex) => {
        console.error('CANNOT LOG REQUEST', ex);
        // ****
        // TODO save on file CANNOT LOG
        // ****
        return request_shape;
    });
}
function _log_auth_route_request(auth_request) {
    if (conf.get('default_atoms_request') === false) {
        return;
    }
    const request_shape = (0, request_1.partial_api_request_to_atom_request)(auth_request);
    const auth_request_clone = uranio_utils_1.urn_util.object.deep_clone(request_shape);
    if (auth_request_clone.body) {
        const body = JSON.parse(auth_request_clone.body);
        body.password = '[DELETED]';
        auth_request_clone.body = JSON.stringify(body);
    }
    const bll_reqs = insta.get_bll_request();
    bll_reqs.insert_new(auth_request_clone).catch((ex) => {
        console.error('CANNOT LOG AUTH REQUEST', ex);
        // ****
        // TODO save on file CANNOT LOG
        // ****
        return request_shape;
    });
}
function _get_auth_token(api_request) {
    const headers = api_request.headers;
    if (!headers) {
        return false;
    }
    if (typeof headers.cookie === 'string') {
        const cookies = headers.cookie.split(';');
        for (const cookie of cookies) {
            const trimmed = cookie.trim();
            const splitted = trimmed.split('=');
            if (splitted[0] === 'urn-auth-token') {
                return splitted[1];
            }
        }
    }
    const auth_header = headers['urn-auth-token'];
    const header_auth_token = (Array.isArray(auth_header)) ? auth_header[0] : auth_header;
    if (typeof header_auth_token === 'string') {
        return header_auth_token;
    }
    return false;
}
//# sourceMappingURL=server.js.map