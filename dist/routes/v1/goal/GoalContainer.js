"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GoalManagementRepository_1 = __importDefault(require("repositories/goal/GoalManagementRepository"));
const GoalService_1 = __importDefault(require("services/goal/GoalService"));
const GoalController_1 = __importDefault(require("controller/goal/GoalController"));
const GoalRouter_1 = __importDefault(require("./GoalRouter"));
class GoalContainer {
    constructor() {
        const repository = new GoalManagementRepository_1.default();
        const service = new GoalService_1.default(repository);
        this.controller = new GoalController_1.default(service);
        this.router = (0, GoalRouter_1.default)(this.controller);
    }
}
exports.default = GoalContainer;
