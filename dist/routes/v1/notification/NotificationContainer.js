"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotificaitonRepository_1 = __importDefault(require("repositories/notifications/NotificaitonRepository"));
const NotificationService_1 = __importDefault(require("services/notification/NotificationService"));
const NotificationController_1 = __importDefault(require("controller/notification/NotificationController"));
const NotificationRouter_1 = __importDefault(require("./NotificationRouter"));
class NotificationContainer {
    constructor() {
        const repository = new NotificaitonRepository_1.default();
        const service = new NotificationService_1.default(repository);
        this.controller = new NotificationController_1.default(service);
        this.router = (0, NotificationRouter_1.default)(this.controller);
    }
}
exports.default = NotificationContainer;
