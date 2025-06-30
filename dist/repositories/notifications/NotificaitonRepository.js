"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotificaionModel_1 = require("model/notification/model/NotificaionModel");
class NotificationManagementRepository {
    createNotification(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const response = yield NotificaionModel_1.NotificationModel.create({ notificationData });
                const createdNotification = {
                    user_id: response.user_id.toString(),
                    message: response.message,
                    isSeen: response.isSeen,
                    is_completed: response.is_completed,
                    reminder_frequency: response.reminder_frequency.toString(),
                    next_reminder_date: ((_a = response === null || response === void 0 ? void 0 : response.next_reminder_date) === null || _a === void 0 ? void 0 : _a.toString()) || '',
                    priority_level: response.priority_level,
                    target_date: ((_b = response === null || response === void 0 ? void 0 : response.target_date) === null || _b === void 0 ? void 0 : _b.toString()) || '',
                    createdAt: (_c = response === null || response === void 0 ? void 0 : response.createdAt) === null || _c === void 0 ? void 0 : _c.toString(),
                    updatedAt: (_d = response === null || response === void 0 ? void 0 : response.updatedAt) === null || _d === void 0 ? void 0 : _d.toString(),
                };
                return createdNotification;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = NotificationManagementRepository;
