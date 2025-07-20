"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRepository_1 = __importDefault(require("repositories/user/UserRepository"));
const UserService_1 = __importDefault(require("services/user/UserService"));
const UserController_1 = __importDefault(require("controller/user/UserController"));
const UserRouter_1 = __importDefault(require("./UserRouter"));
class UserContainer {
    constructor() {
        const repository = new UserRepository_1.default();
        const service = new UserService_1.default(repository);
        this.controller = new UserController_1.default(service);
        this.router = (0, UserRouter_1.default)(this.controller);
    }
}
exports.default = UserContainer;
