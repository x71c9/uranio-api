"use strict";
/**
 * Netlify class module
 *
 * @packageDocumentation
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
// import parse_multipart from 'parse-multipart';
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('NETLIFYCLASS', 'Netlify class module');
const uranio_core_1 = __importDefault(require("uranio-core"));
const request_1 = require("../../util/request");
const server_1 = require("../../mdlw/server");
// import {map_lambda_query_params, parse_multipart} from '../util';
const util_1 = require("../util");
let NetlifyLambda = class NetlifyLambda {
    // constructor(connect=false){
    //   if(connect === true){
    //     core.db.connect();
    //   }
    // }
    async handle(event, context) {
        const partial_api_request = _lambda_request_to_partial_api_request(event, context);
        try {
            // This will throw an error if it cannot JSON parse the body.
            // That is why it is outside `_lambda_request_to_partial_api_request`
            const body = await _filter_lambda_body_request(event, partial_api_request);
            if (body) {
                partial_api_request.body = body;
            }
            const api_request = (0, request_1.validate_request)(partial_api_request);
            const urn_res = await this.lambda_route(api_request);
            // core.disconnect().then(() => {
            //   urn_log.debug(`Database disconnected.`);
            // });
            return _lambda_response(urn_res);
        }
        catch (e) {
            const ex = e;
            const urn_err = (0, request_1.api_handle_and_store_exception)(ex, partial_api_request);
            return _lambda_response(urn_err);
        }
    }
    async lambda_route(api_request) {
        if (api_request.is_auth) {
            // ****
            // TODO CHECK - Maybe this can be a bad idea - to create the BLL on request
            // instead of passing only one reference. But it must be for each auth atom.
            // We do it anyway a bll for each call depending on the `path`.
            // ****
            const auth_bll = uranio_core_1.default.bll.auth.create(api_request.atom_name);
            const auth_handler = async (api_request) => {
                var _a, _b;
                const token = await auth_bll.authenticate((_a = api_request.body) === null || _a === void 0 ? void 0 : _a.email, (_b = api_request.body) === null || _b === void 0 ? void 0 : _b.password);
                return token;
            };
            return (0, server_1.auth_route_middleware)(api_request, auth_handler);
        }
        else {
            return (0, server_1.route_middleware)(api_request);
        }
    }
};
NetlifyLambda = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], NetlifyLambda);
async function _filter_lambda_body_request(event, api_request) {
    var _a;
    let body = null;
    // ----
    // For some reason when TRX call a `delete` hook, the lambda Netlify function
    // receives a string type `body` equal to `[object Object]`.
    // I tried to debug. It seems Axios is not responsible. It should not send any
    // body with DELETE method.
    // I tried to remove the netlify redirect but with no success.
    // It might be something in the Netlify Lambda function.
    // ----
    if (event.body === "[object Object]") {
        event.body = null;
    }
    if (event.isBase64Encoded === true && typeof event.body === 'string') {
        api_request.file = {
            name: '[NONAME]',
            data: Buffer.from(''),
            size: 0,
            mime_type: ''
        };
        if (((_a = event.headers['content-type']) === null || _a === void 0 ? void 0 : _a.indexOf('multipart/form-data')) === 0) {
            const multipart = await (0, util_1.lambra_multipart_parse)(event);
            api_request.file.name = multipart.files[0].filename;
            api_request.file.data = multipart.files[0].content;
            api_request.file.mime_type = multipart.files[0].contentType;
            api_request.file.size = multipart.files[0].content.length;
            // const content_type = event.headers['content-type'];
            // const boundary = content_type.split(';')[1]?.trim().split('=')[1]?.trim();
            // if(boundary){
            //   const buffer = Buffer.from(event.body, 'base64');
            //   const parts = parse_multipart(buffer, boundary);
            //   for(const part of parts.reverse()){
            //     if(typeof part.filename === 'string' && Buffer.isBuffer(part.data)){
            //       api_request.file.name = part.filename;
            //       api_request.file.data = part.data;
            //       api_request.file.mime_type = part.type || '';
            //       api_request.file.size = part.data.length;
            //       break;
            //     }
            //   }
            //   return null;
            // }
        }
        return '[Base64Body]';
    }
    if (event.body) {
        try {
            body =
                typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        }
        catch (e) {
            const err = e;
            throw urn_exc.create_invalid_request(`INVALID_BODY_REQUEST`, `Invalid body format. Body must be in JSON format.`, err);
        }
    }
    return body;
}
function _lambda_request_to_partial_api_request(event, context) {
    var _a;
    const api_request_paths = (0, request_1.process_request_path)(event.path);
    const api_request = {
        ...api_request_paths,
        method: event.httpMethod,
        params: {},
        query: (0, util_1.map_lambda_query_params)(event.queryStringParameters || {}),
    };
    const atom_name = (0, request_1.get_atom_name_from_atom_path)(api_request_paths.atom_path);
    if (!atom_name) {
        return api_request;
    }
    api_request.atom_name = atom_name;
    const route_name = (0, request_1.get_route_name)(atom_name, api_request_paths.route_path, event.httpMethod);
    if (!route_name) {
        return api_request;
    }
    const is_auth = (0, request_1.is_auth_request)(atom_name, api_request_paths.atom_path);
    const auth_action = (0, request_1.get_auth_action)(atom_name, route_name);
    const ip = ((_a = context.identity) === null || _a === void 0 ? void 0 : _a.sourceIp) || event.headers['client-ip'] || event.headers['X-Nf-Client-Connection-Ip'];
    const params = (0, request_1.get_params_from_route_path)(atom_name, route_name, api_request_paths.route_path);
    if (event.headers) {
        api_request.headers = event.headers;
    }
    if (ip) {
        api_request.ip = ip;
    }
    api_request.route_name = route_name;
    api_request.is_auth = is_auth;
    api_request.auth_action = auth_action;
    api_request.ip = ip;
    api_request.params = params;
    if (is_auth) {
        api_request.auth_action = uranio_core_1.default.types.AuthAction.READ;
        api_request.route_name = 'auth';
    }
    return api_request;
}
function _lambda_response(urn_resp, headers, multi_value_headers, is_base64) {
    var _a, _b;
    const handler_response = {
        statusCode: urn_resp.status,
    };
    if ((_a = urn_resp.payload) === null || _a === void 0 ? void 0 : _a.headers) {
        handler_response.headers = urn_resp.payload.headers;
        delete urn_resp.payload.headers;
    }
    if (headers) {
        handler_response.headers = headers;
    }
    if ((_b = urn_resp.payload) === null || _b === void 0 ? void 0 : _b.multi_value_headers) {
        handler_response.multiValueHeaders = urn_resp.payload.multi_value_headers;
        delete urn_resp.payload.multi_value_headers;
    }
    if (multi_value_headers) {
        handler_response.multiValueHeaders = multi_value_headers;
    }
    if (typeof is_base64 === 'boolean') {
        handler_response.isBase64Encoded = is_base64;
    }
    handler_response.body = urn_lib_1.urn_util.json.safe_stringify(urn_resp);
    return handler_response;
}
function create() {
    urn_lib_1.urn_log.fn_debug(`Create NetlifyLambda`);
    return new NetlifyLambda();
}
exports.create = create;
// export function connect_and_create():NetlifyLambda{
//   urn_log.fn_debug(`Create NetlifyLambda`);
//   return new NetlifyLambda(true);
// }
//# sourceMappingURL=class.js.map