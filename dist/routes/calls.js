"use strict";
/**
 * Server part of routes module
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.return_default_routes = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init(`API_ROUTE_SERVER`, `Api route server module`);
const uranio_core_1 = __importDefault(require("uranio-core"));
// import {Book as ClientBook} from '../typ/book_cln';
const client_1 = require("./client");
// import {
//   route_def as common_route_def,
//   atom_dock_with_defaults as common_atom_dock_with_defaults
// } from './common';
// export function route_def<A extends schema.AtomName, R extends schema.RouteName<A>>(atom_name:A, route_name:R)
//     :types.Book.Definition.Dock.Routes.Route<A,R>{
//   const server_default_routes = return_default_routes(atom_name) as ClientBook.Definition.Dock.Routes;
//   return common_route_def(server_default_routes, atom_name, route_name);
// }
// export function atom_dock_with_defaults<A extends core.schema.AtomName>(
//   default_routes:ClientBook.Definition.Dock.Routes,
//   atom_name:A
// ):types.Book.Definition.Dock<A>{
//   return common_atom_dock_with_defaults(default_routes, atom_name) as types.Book.Definition.Dock<A>;
// }
function return_default_routes(atom_name) {
    let default_routes = urn_lib_1.urn_util.json.clean_parse(urn_lib_1.urn_util.json.safe_stringify(client_1.default_routes));
    if (atom_name === 'media') {
        default_routes = (0, client_1.add_media_routes)();
        default_routes.upload.call =
            async (api_request) => {
                urn_lib_1.urn_log.fn_debug(`Router Call POST [upload] / [${atom_name}]`);
                if (!api_request.file) {
                    throw urn_exc.create_invalid_request(`INVALID_REQUEST_MISSING_FILE_PARAM`, `Missing file param in api_request on upload media route.`);
                }
                const urn_media_bll = uranio_core_1.default.bll.media.create(api_request.passport);
                const params = {
                    override: false,
                    content_type: api_request.file.mime_type,
                    content_length: api_request.file.size
                };
                const atom_media = await urn_media_bll.insert_file(api_request.file.name, api_request.file.data, params);
                return atom_media;
            };
        default_routes.presigned.call =
            async (api_request) => {
                urn_lib_1.urn_log.fn_debug(`Router Call GET [presigned] / [${atom_name}]`);
                if (!api_request.query) {
                    throw urn_exc.create_invalid_request(`INVALID_REQUEST_MISSING_QUERY`, `Missing query in api_request on presigned media route.`);
                }
                const urn_media_bll = uranio_core_1.default.bll.media.create(api_request.passport);
                const params = {
                    content_type: api_request.query.type,
                    content_length: Number(api_request.query.size)
                };
                const atom_media = await urn_media_bll.presigned(api_request.query.filename, params);
                return atom_media;
            };
    }
    default_routes.count.call =
        async (api_request) => {
            urn_lib_1.urn_log.fn_debug(`Router Call GET [count] / [${atom_name}]`);
            const urn_bll = uranio_core_1.default.bll.create(atom_name, api_request.passport);
            const filter = api_request.query.filter || {};
            const bll_res = await urn_bll.count(filter);
            return bll_res;
        };
    default_routes.find_one.call =
        async (api_request) => {
            urn_lib_1.urn_log.fn_debug(`Router Call GET [find_one] / [${atom_name}]`);
            const urn_bll = uranio_core_1.default.bll.create(atom_name, api_request.passport);
            const filter = api_request.query.filter || {};
            const options = api_request.query.options;
            const bll_res = await urn_bll.find_one(filter, options);
            return bll_res;
        };
    default_routes.find.call =
        async (api_request) => {
            urn_lib_1.urn_log.fn_debug(`Router Call GET [find] / [${atom_name}]`);
            const urn_bll = uranio_core_1.default.bll.create(atom_name, api_request.passport);
            const filter = api_request.query.filter || {};
            const options = api_request.query.options;
            const bll_res = await urn_bll.find(filter, options);
            return bll_res;
        };
    default_routes.find_id.call =
        async (api_request) => {
            urn_lib_1.urn_log.fn_debug(`Router Call GET [find_id] /:id [${atom_name}]`);
            const urn_bll = uranio_core_1.default.bll.create(atom_name, api_request.passport);
            const bll_res = await urn_bll.find_by_id(api_request.params.id, api_request.query.options);
            return bll_res;
        };
    default_routes.insert.call =
        async (api_request) => {
            urn_lib_1.urn_log.fn_debug(`Router Call POST [insert] / [${atom_name}]`);
            const urn_bll = uranio_core_1.default.bll.create(atom_name, api_request.passport);
            if (!api_request.body) {
                throw urn_exc.create_invalid_request(`INVALID_REQUEST_BODY`, `Invalid request body.`);
            }
            // if(Array.isArray(api_request.body)){
            //   return await urn_bll.insert_multiple(api_request.body);
            // }
            const bll_res = await urn_bll.insert_new(api_request.body);
            return bll_res;
        };
    default_routes.update.call =
        async (api_request) => {
            var _a;
            urn_lib_1.urn_log.fn_debug(`Router Call POST [update] / [${atom_name}]`);
            const urn_bll = uranio_core_1.default.bll.create(atom_name, api_request.passport);
            if (!api_request.body) {
                throw urn_exc.create_invalid_request(`INVALID_REQUEST_UPDATE_BODY`, `Invalid request body.`);
            }
            if (!api_request.params || !api_request.params.id) {
                throw urn_exc.create_invalid_request(`INVALID_REQUEST_PARAM_ID`, `Invalid request parameter \`id\`.`);
            }
            // const ids = api_request.params?.id?.split(',') || [];
            // if(ids.length > 1){
            //   return await urn_bll.update_multiple(ids, api_request.body);
            // }
            const bll_res = await urn_bll.update_by_id((_a = api_request.params) === null || _a === void 0 ? void 0 : _a.id, api_request.body);
            return bll_res;
        };
    default_routes.delete.call =
        async (api_request) => {
            var _a;
            urn_lib_1.urn_log.fn_debug(`Router Call DELETE [delete] / [${atom_name}]`);
            const urn_bll = uranio_core_1.default.bll.create(atom_name, api_request.passport);
            if (!((_a = api_request.params) === null || _a === void 0 ? void 0 : _a.id)) {
                throw urn_exc.create_invalid_request(`INVALID_REQUEST_DELETE_PARAM_ID`, `Invalid request parameter \`id\`.`);
            }
            // const ids = api_request.params.id?.split(',') || [];
            // if(ids.length > 1){
            //   return await urn_bll.remove_multiple(ids);
            // }
            const bll_res = await urn_bll.remove_by_id(api_request.params.id);
            return bll_res;
        };
    default_routes.insert_multiple.call =
        async (api_request) => {
            urn_lib_1.urn_log.fn_debug(`Router Call POST [insert_multiple] / [${atom_name}]`);
            const urn_bll = uranio_core_1.default.bll.create(atom_name, api_request.passport);
            if (!api_request.body || !Array.isArray(api_request.body)) {
                throw urn_exc.create_invalid_request(`INVALID_REQUEST_INSERT_MULTIPLE_BODY`, `Invalid request body.`);
            }
            return await urn_bll.insert_multiple(api_request.body);
        };
    default_routes.update_multiple.call =
        async (api_request) => {
            var _a, _b, _c;
            urn_lib_1.urn_log.fn_debug(`Router Call POST [update_multiple] / [${atom_name}]`);
            const urn_bll = uranio_core_1.default.bll.create(atom_name, api_request.passport);
            if (!api_request.body) {
                throw urn_exc.create_invalid_request(`INVALID_REQUEST_UPDATE_MULTIPLE_BODY`, `Invalid request body.`);
            }
            if (!((_a = api_request.params) === null || _a === void 0 ? void 0 : _a.ids)) {
                throw urn_exc.create_invalid_request(`INVALID_REQUEST_UPDATE_MULTIPLE_PARAM_IDS`, `Invalid request parameter \`ids\`.`);
            }
            const ids = ((_c = (_b = api_request.params) === null || _b === void 0 ? void 0 : _b.ids) === null || _c === void 0 ? void 0 : _c.split(',')) || [];
            return await urn_bll.update_multiple(ids, api_request.body);
        };
    default_routes.delete_multiple.call =
        async (api_request) => {
            var _a, _b;
            urn_lib_1.urn_log.fn_debug(`Router Call DELETE [delete_multiple] / [${atom_name}]`);
            const urn_bll = uranio_core_1.default.bll.create(atom_name, api_request.passport);
            if (!((_a = api_request.params) === null || _a === void 0 ? void 0 : _a.ids)) {
                throw urn_exc.create_invalid_request(`INVALID_REQUEST_DELETE_MULTIPLE_PARAM_IDS`, `Invalid request parameter \`ids\`.`);
            }
            const ids = ((_b = (api_request.params.ids)) === null || _b === void 0 ? void 0 : _b.split(',')) || [];
            return await urn_bll.remove_multiple(ids);
        };
    default_routes.search.call =
        async (api_request) => {
            urn_lib_1.urn_log.fn_debug(`Router Call GET [search] / [${atom_name}]`);
            const urn_bll = uranio_core_1.default.bll.create(atom_name, api_request.passport);
            const q = api_request.params.q;
            const options = api_request.query.options;
            const bll_res = await urn_bll.search(q || '', options);
            return bll_res;
        };
    return default_routes;
}
exports.return_default_routes = return_default_routes;
//# sourceMappingURL=calls.js.map