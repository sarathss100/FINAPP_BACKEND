"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InsuranceManagementRepository_1 = __importDefault(require("repositories/insurances/InsuranceManagementRepository"));
const InsuranceService_1 = __importDefault(require("services/insurances/InsuranceService"));
const InsuranceController_1 = __importDefault(require("controller/insurances/InsuranceController"));
const InsuranceRouter_1 = __importDefault(require("./InsuranceRouter"));
class InsuranceContainer {
    constructor() {
        const repository = new InsuranceManagementRepository_1.default();
        const service = new InsuranceService_1.default(repository);
        this.controller = new InsuranceController_1.default(service);
        this.router = (0, InsuranceRouter_1.default)(this.controller);
    }
}
exports.default = InsuranceContainer;
