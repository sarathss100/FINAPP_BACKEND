"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DebtManagementRepository_1 = __importDefault(require("repositories/debt/DebtManagementRepository"));
const DebtService_1 = __importDefault(require("services/debt/DebtService"));
const DebtController_1 = __importDefault(require("controller/debt/DebtController"));
const debtRouter_1 = __importDefault(require("./debtRouter"));
class DebtContainer {
    constructor() {
        const repository = new DebtManagementRepository_1.default();
        const service = new DebtService_1.default(repository);
        this.controller = new DebtController_1.default(service);
        this.router = (0, debtRouter_1.default)(this.controller);
    }
}
exports.default = DebtContainer;
