"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthService_1 = __importDefault(require("services/auth/AuthService"));
const AuthController_1 = __importDefault(require("controller/auth/AuthController"));
const hash_1 = __importDefault(require("utils/auth/hash"));
const AuthRepository_1 = __importDefault(require("repositories/auth/AuthRepository"));
const AuthRouter_1 = __importDefault(require("./AuthRouter"));
const hasher = new hash_1.default();
class AuthContainer {
    constructor() {
        const repository = new AuthRepository_1.default();
        const service = new AuthService_1.default(repository, hasher);
        this.controller = new AuthController_1.default(service);
        this.router = (0, AuthRouter_1.default)(this.controller);
    }
}
exports.default = AuthContainer;
