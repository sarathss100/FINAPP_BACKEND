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
exports.ServerHealthCheckService = void 0;
class ServerHealthCheckService {
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            const uptime = process.uptime();
            if (uptime <= 0) {
                return {
                    status: 'unhealthy',
                    details: 'Server uptime is negative',
                    lastChecked: new Date(),
                };
            }
            else if (uptime < 60) { // less than 1 minute
                return {
                    status: 'degraded',
                    details: `Server uptime is ${String(process.uptime().toFixed(2))} seconds`,
                    lastChecked: new Date(),
                };
            }
            // healthy if uptime is greater than 1 minute
            return {
                status: 'healthy',
                details: `Server uptime is ${String(process.uptime().toFixed(2))} seconds`,
                lastChecked: new Date(),
            };
        });
    }
}
exports.ServerHealthCheckService = ServerHealthCheckService;
