"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusToScore = void 0;
const statusToScore = (status) => {
    switch (status) {
        case 'healthy':
            return 100;
        case 'degraded':
            return 50;
        case 'unhealthy':
            return 0;
        default:
            return 0;
    }
};
exports.statusToScore = statusToScore;
