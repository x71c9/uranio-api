"use strict";
/**
 * Express Authentication route module
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_express_auth_route = void 0;
const express_1 = __importDefault(require("express"));
const urn_lib_1 = require("urn-lib");
const uranio_core_1 = __importDefault(require("uranio-core"));
const server_1 = require("../../../mdlw/server");
const request_1 = require("../../../util/request");
const common_1 = require("./common");
function create_express_auth_route(atom_name) {
    urn_lib_1.urn_log.fn_debug(`Create Express Auth Atom Router [${atom_name}]`);
    const router = express_1.default.Router();
    const auth_bll = uranio_core_1.default.bll.auth.create(atom_name);
    const handler = async (route_request) => {
        const token = await auth_bll.authenticate(route_request.body.email, route_request.body.password);
        return token;
    };
    router.post('/', _return_express_auth_middleware(handler));
    return router;
}
exports.create_express_auth_route = create_express_auth_route;
function _return_express_auth_middleware(handler) {
    return async (req, res, _next) => {
        const partial_api_request = (0, common_1.express_request_to_partial_api_request)(req);
        try {
            const api_request = (0, request_1.validate_request)(partial_api_request);
            const urn_res = await (0, server_1.auth_route_middleware)(api_request, handler);
            return (0, common_1.return_uranio_response_to_express)(urn_res, res);
        }
        catch (e) {
            const ex = e;
            const urn_err = (0, request_1.api_handle_and_store_exception)(ex, partial_api_request);
            return (0, common_1.return_uranio_response_to_express)(urn_err, res);
        }
    };
}
//# sourceMappingURL=auth.js.map