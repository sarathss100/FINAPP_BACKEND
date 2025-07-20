"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AccountsManagementRepository_1 = __importDefault(require("repositories/accounts/AccountsManagementRepository"));
const AccountService_1 = __importDefault(require("services/accounts/AccountService"));
const AccountsController_1 = __importDefault(require("controller/accounts/AccountsController"));
const AccountsRouter_1 = __importDefault(require("./AccountsRouter"));
class AccountsContainer {
    constructor() {
        const repository = new AccountsManagementRepository_1.default();
        const service = new AccountService_1.default(repository);
        this.controller = new AccountsController_1.default(service);
        this.router = (0, AccountsRouter_1.default)(this.controller);
    }
}
exports.default = AccountsContainer;
