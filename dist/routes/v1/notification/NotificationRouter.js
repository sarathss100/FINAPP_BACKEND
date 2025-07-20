"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NotificaitonRepository_1 = __importDefault(require("repositories/notifications/NotificaitonRepository"));
const NotificationService_1 = __importDefault(require("services/notification/NotificationService"));
const NotificationController_1 = __importDefault(require("controller/notification/NotificationController"));
const router = (0, express_1.Router)();
const notificationRepository = new NotificaitonRepository_1.default();
const notificationService = new NotificationService_1.default(notificationRepository);
const notificatonController = new NotificationController_1.default(notificationService);
router.post('/', notificatonController.createNotification.bind(notificatonController));
router.get('/', notificatonController.getNotifications.bind(notificatonController));
router.patch('/archieve/:notificationId', notificatonController.updateArchieveStatus.bind(notificatonController));
router.patch('/seen/all', notificatonController.updateReadStatusAll.bind(notificatonController));
router.patch('/seen/:notificationId', notificatonController.updateReadStatus.bind(notificatonController));
exports.default = router;
