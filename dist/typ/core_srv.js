"use strict";
/**
 * Module that re-export all server core types
 * but Book and Configuration that need to be re-exported in other modules
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityType = exports.PermissionType = exports.PropertyType = exports.AuthAction = void 0;
var types_1 = require("uranio-core/types");
Object.defineProperty(exports, "AuthAction", { enumerable: true, get: function () { return types_1.AuthAction; } });
Object.defineProperty(exports, "PropertyType", { enumerable: true, get: function () { return types_1.PropertyType; } });
Object.defineProperty(exports, "PermissionType", { enumerable: true, get: function () { return types_1.PermissionType; } });
Object.defineProperty(exports, "SecurityType", { enumerable: true, get: function () { return types_1.SecurityType; } });
// export type Passport = core_types.Passport;
// export type Database = core_types.Database;
// export type Storage = core_types.Storage;
// export type PropertyType = core.types.PropertyType;
// export type PermissionType = core.types.PermissionType;
// export type SecurityType = core.types.SecurityType;
//# sourceMappingURL=core_srv.js.map