"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotificaitonSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isSeen: {
        type: Boolean,
        required: true
    },
    is_completed: {
        type: Boolean,
        default: false
    },
    reminder_frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly', 'None'],
        default: 'None'
    },
    next_reminder_date: {
        type: Date
    },
    priority_level: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    target_date: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true
});
exports.default = NotificaitonSchema;
