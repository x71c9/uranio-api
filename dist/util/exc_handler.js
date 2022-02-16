"use strict";
/**
 * Module for handling exceptions and rejected promises
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.register_exception_handler = void 0;
const insta = __importStar(require("../nst/index"));
/*
 * Function for handling exception.
 * It should log the exception and stop the application.
 *
 * @params ex - The exception
 */
function handle_exception(service_name) {
    return async (ex) => {
        console.error(service_name, ex);
        const bll_err = insta.get_bll_error();
        bll_err.insert_new({
            status: 500,
            msg: `[${service_name}] UnhandledException`,
            error_code: '500',
            error_msg: ex.message,
            stack: ex.stack
        }).catch((_ex) => {
            // TODO
        });
        // process.exit(1);
    };
}
/*
 * Function for handling rejected promises.
 * It should log the rejected promise and stop the application.
 *
 * @param reason - the reason
 * @param promise - the promise
 */
function handle_rejected_promise(service_name) {
    return (reason, promise) => {
        console.error(service_name, reason, promise);
        const bll_err = insta.get_bll_error();
        bll_err.insert_new({
            status: 510,
            msg: `[${service_name}] UnhandledRejectedPromise`,
            error_code: '510',
            error_msg: JSON.stringify(reason),
            stack: JSON.stringify(promise)
        }).catch((_ex) => {
            // TODO
        });
        // process.exit(1);
    };
}
/*
 * Function that will assign to process uncaughtException handle_exception and
 * to unhandledRejection handleRejectionPromise functions.
 */
function register_exception_handler(name) {
    process.on('uncaughtException', handle_exception(name));
    process.on('unhandledRejection', handle_rejected_promise(name));
}
exports.register_exception_handler = register_exception_handler;
/*
 * Calling register_exception_handler
 */
// register_exception_handler();
//# sourceMappingURL=exc_handler.js.map