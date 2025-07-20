"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdminController_1 = __importDefault(require("controller/admin/AdminController"));
const AdminRepository_1 = __importDefault(require("repositories/admin/AdminRepository"));
const AdminService_1 = __importDefault(require("services/admin/AdminService"));
const AdminRouter_1 = __importDefault(require("./AdminRouter"));
class AdminContainer {
    constructor() {
        const repository = new AdminRepository_1.default();
        const service = new AdminService_1.default(repository);
        this.controller = new AdminController_1.default(service);
        this.router = (0, AdminRouter_1.default)(this.controller);
    }
}
exports.default = AdminContainer;
