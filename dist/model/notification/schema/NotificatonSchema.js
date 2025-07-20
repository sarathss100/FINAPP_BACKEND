"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const INotificaiton_1 = require("../interfaces/INotificaiton");
const NotificaitonSchema = new mongoose_1.Schema({
    user_id: {
        type: String,
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: INotificaiton_1.NOTIFICATION_TYPES,
        required: true,
    },
    is_read: {
        type: Boolean,
        default: false,
    },
    meta: {
        type: mongoose_1.Schema.Types.Mixed,
        default: null,
    },
    archived: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});
exports.default = NotificaitonSchema;
