"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvestmentManagementRepository_1 = __importDefault(require("repositories/investments/InvestmentManagementRepository"));
const InvestmentService_1 = __importDefault(require("services/investments/InvestmentService"));
const InvestmentController_1 = __importDefault(require("controller/investments/InvestmentController"));
const InvestmentRouter_1 = __importDefault(require("./InvestmentRouter"));
class InvestmentContainer {
    constructor() {
        const repository = new InvestmentManagementRepository_1.default();
        const service = new InvestmentService_1.default(repository);
        this.controller = new InvestmentController_1.default(service);
        this.router = (0, InvestmentRouter_1.default)(this.controller);
    }
}
exports.default = InvestmentContainer;
