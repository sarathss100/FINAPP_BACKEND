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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisHealthCheckService = void 0;
const RedisService_1 = __importDefault(require("services/redis/RedisService"));
const client = RedisService_1.default.getClient();
class RedisHealthCheckService {
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pingResponse = yield client.ping();
                if (pingResponse === 'PONG') {
                    return {
                        status: 'healthy',
                        score: 100,
                        details: 'Redis is healthy',
                        lastChecked: new Date(),
                    };
                }
                else {
                    return {
                        status: 'unhealthy',
                        score: 0,
                        details: 'Redis is not responding as expected',
                        lastChecked: new Date(),
                    };
                }
            }
            catch (error) {
                return {
                    status: 'unhealthy',
                    score: 0,
                    details: `Redis check failed: ${error.message}`,
                    lastChecked: new Date(),
                };
            }
        });
    }
}
exports.RedisHealthCheckService = RedisHealthCheckService;
