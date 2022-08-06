"use strict";
/**
 * Express class module
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
const fs_1 = __importDefault(require("fs"));
// import path from 'path';
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init(`EXPRESSCLASS`, `Express class module`);
const urn_ret = urn_lib_1.urn_return.create(urn_lib_1.urn_log.util.return_injector);
const env = __importStar(require("../../env/server"));
const book = __importStar(require("../../book/server"));
const exc_handler_1 = require("../../util/exc_handler");
const conf = __importStar(require("../../conf/server"));
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
        const conf_prefix_api = conf.get('prefix_api');
        const conf_prefix_log = conf.get('prefix_log');
        for (const [atom_name, atom_def] of Object.entries(book.get_all_definitions())) {
            const dock_def = atom_def.dock;
            const dock_url = book.get_dock_url(atom_name);
            const router = (0, index_1.create_express_route)(atom_name);
            const prefix_api = (conf_prefix_api[0] !== '/') ? `/${conf_prefix_api}` : conf_prefix_api;
            let prefix_log = '';
            if (atom_def.connection && atom_def.connection === 'log') {
                prefix_log = (conf_prefix_log[0] !== '/') ? `/${conf_prefix_log}` : conf_prefix_log;
            }
            const full_url = `${prefix_api}${prefix_log}${dock_url}`;
            urn_lib_1.urn_log.trace(`Creating Express route [${full_url}]`);
            this.express_app.use(full_url, router);
            if (dock_def && dock_def.auth_url && typeof dock_def.auth_url === 'string') {
                const auth_route = (0, index_1.create_express_auth_route)(atom_name);
                const full_auth_url = `${prefix_api}${dock_def.auth_url}`;
                urn_lib_1.urn_log.trace(`Creating Express auth route [${full_auth_url}]`);
                this.express_app.use(full_auth_url, auth_route);
            }
        }
    }
    listen(portcall, callback) {
        let service_port = 7777;
        const current_port = conf.get(`service_port`);
        if (typeof current_port === 'number') {
            service_port = current_port;
        }
        const uranio_callback = function () {
            urn_lib_1.urn_log.debug(`Uranio service is listening on port ${service_port}...`);
            if (typeof portcall === 'function') {
                portcall();
            }
            else if (typeof callback === 'function') {
                callback();
            }
        };
        let server = http_1.default.createServer(this.express_app);
        if (env.get('https')) {
            const serverOptions = {
                // Certificate(s) & Key(s)
                // cert: fs.readFileSync(path.join(__dirname, '../../../cert/cert.pem')),
                // key: fs.readFileSync(path.join(__dirname, '../../../cert/key.pem')),
                cert: fs_1.default.readFileSync(env.get('ssl_certificate')),
                key: fs_1.default.readFileSync(env.get('ssl_key')),
                // TLS Versions
                // maxVersion: 'TLSv1.3',
                // minVersion: 'TLSv1.2'
                // Hardened configuration
                // ciphers: 'TLS_AES_256_GCM_SHA384:TLS_AES_128_GCM_SHA256',
                // ecdhCurve: 'P-521:P-384',
                // sigalgs: 'ecdsa_secp384r1_sha384',
                // Attempt to use server cipher suite preference instead of clients
                // honorCipherOrder: true
            };
            server = https_1.default.createServer(serverOptions, this.express_app);
        }
        switch (typeof portcall) {
            case 'undefined':
            case 'function': {
                server.listen(service_port, uranio_callback);
                break;
            }
            case 'number': {
                server.listen(portcall, uranio_callback);
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
    urn_lib_1.urn_log.trace(`Create ExpressWebService`);
    return new ExpressWebService();
}
exports.create = create;
//# sourceMappingURL=class.js.map