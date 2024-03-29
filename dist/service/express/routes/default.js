"use strict";
/**
 * Express default route module
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
exports.create_express_route = void 0;
const express_1 = __importDefault(require("express"));
const uranio_utils_1 = require("uranio-utils");
const book = __importStar(require("../../../book/server"));
const types = __importStar(require("../../../srv/types"));
// import {return_default_routes} from '../../../routes/server';
const server_1 = require("../../../mdlw/server");
const request_1 = require("../../../util/request");
const common_1 = require("./common");
function create_express_route(atom_name) {
    uranio_utils_1.urn_log.trace(`Create Express Default Atom Router [${atom_name}]`);
    const router = express_1.default.Router();
    const routes_definition = book.get_routes_definition(atom_name);
    for (const [_route_name, route_definition] of Object.entries(routes_definition)) {
        const route_def = route_definition;
        switch (route_def.method) {
            case types.RouteMethod.GET: {
                router.get(route_def.url, _return_express_middleware());
                break;
            }
            case types.RouteMethod.POST: {
                router.post(route_def.url, _return_express_middleware());
                break;
            }
            case types.RouteMethod.DELETE: {
                router.delete(route_def.url, _return_express_middleware());
                break;
            }
        }
    }
    return router;
}
exports.create_express_route = create_express_route;
function _return_express_middleware() {
    return async (req, res, _next) => {
        const partial_api_request = (0, common_1.express_request_to_partial_api_request)(req);
        try {
            const api_request = (0, request_1.validate_request)(partial_api_request);
            const urn_res = await (0, server_1.route_middleware)(api_request);
            return (0, common_1.return_uranio_response_to_express)(urn_res, res);
        }
        catch (e) {
            const ex = e;
            const urn_err = (0, request_1.api_handle_and_store_exception)(ex, partial_api_request);
            return (0, common_1.return_uranio_response_to_express)(urn_err, res);
        }
    };
}
//# sourceMappingURL=default.js.map