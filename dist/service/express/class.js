"use strict";
/**
 * Express class module
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.create = void 0;
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init(`EXPRESSCLASS`, `Express class module`);
const urn_ret = urn_lib_1.urn_return.create(urn_lib_1.urn_log.util.return_injector);
const book = __importStar(require("../../book/index"));
const exc_handler_1 = require("../../util/exc_handler");
const conf = __importStar(require("../../conf/index"));
const index_1 = require("./routes/index");
let ExpressWebService = class ExpressWebService {
    constructor(service_name = 'main') {
        this.service_name = service_name;
        (0, exc_handler_1.register_exception_handler)(service_name);
        this.express_app = (0, express_1.default)();
        this.express_app.use((0, cors_1.default)());
        this.express_app.use(express_1.default.json());
        this.express_app.use(express_1.default.urlencoded({ extended: true }));
        this.express_app.use((0, express_fileupload_1.default)());
        this.express_app.use(function (err, _req, res, next) {
            if (err.status === 400 && "body" in err) {
                const respo = urn_ret.return_error(400, 'JSON parse error', 'INVALID_JSON_REQUEST', err.message);
                res.status(respo.status).json(respo);
            }
            else {
                next();
            }
        });
        const prefix_api = conf.get('prefix_api');
        const prefix_log = conf.get('prefix_log');
        for (const atom_name of book.get_names()) {
            const dock_def = book.get_dock_definition(atom_name);
            const atom_def = book.get_definition(atom_name);
            const router = (0, index_1.create_express_route)(atom_name);
            if (dock_def && typeof dock_def.url === 'string' && dock_def.url !== '') {
                if (atom_def.connection && atom_def.connection === 'log') {
                    // console.log(`${prefix_api}${prefix_log}${dock_def.url}`);
                    this.express_app.use(`${prefix_api}${prefix_log}${dock_def.url}`, router);
                }
                else {
                    // console.log(`${prefix_api}${dock_def.url}`);
                    this.express_app.use(`${prefix_api}${dock_def.url}`, router);
                }
            }
            if (dock_def && dock_def.auth_url && typeof dock_def.auth_url === 'string') {
                const auth_route = (0, index_1.create_express_auth_route)(atom_name);
                // console.log(`${prefix_api}${dock_def.auth_url}`);
                this.express_app.use(`${prefix_api}${dock_def.auth_url}`, auth_route);
            }
        }
    }
    listen(portcall, callback) {
        switch (typeof portcall) {
            case 'function': {
                this.express_app.listen(conf.get(`service_port`), portcall);
                break;
            }
            case 'number': {
                this.express_app.listen(portcall, callback);
                break;
            }
            default: {
                throw urn_exc.create(`INVALID_LISTEN_ARGS`, 'Invalid arguments.');
            }
        }
    }
};
ExpressWebService = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], ExpressWebService);
function create() {
    urn_lib_1.urn_log.fn_debug(`Create ExpressWebService`);
    return new ExpressWebService();
}
exports.create = create;
//# sourceMappingURL=class.js.map