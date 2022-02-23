"use strict";
/**
 * Lambda index module
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const conf = __importStar(require("../conf/server"));
const netlify = __importStar(require("./netlify/index"));
__exportStar(require("./types"), exports);
function create(lambda_name) {
    const lambda = lambda_name || conf.get(`lambda`);
    switch (lambda) {
        case 'netlify': {
            return netlify.create();
        }
    }
}
exports.create = create;
// export function connect_and_create(lambda_name?:LambdaName)
//     :Lambda{
//   const lambda = lambda_name || conf.get(`lambda`);
//   switch(lambda){
//     case 'netlify':{
//       return netlify.connect_and_create();
//     }
//   }
// }
//# sourceMappingURL=server.js.map