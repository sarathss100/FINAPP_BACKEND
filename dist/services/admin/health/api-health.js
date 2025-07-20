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
exports.ExternalApiHealthCheckService = void 0;
const axios_1 = __importDefault(require("axios"));
class ExternalApiHealthCheckService {
    constructor(url) {
        this.url = url;
    }
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const start = Date.now();
                const res = yield axios_1.default.get(this.url, { timeout: 5000 });
                const latency = Date.now() - start;
                return {
                    status: res.status >= 200 && res.status < 300 ? 'healthy' : 'degraded',
                    score: res.status >= 200 && res.status < 300 ? 100 : 50,
                    details: `Latency : ${latency}ms`,
                    lastChecked: new Date(),
                };
            }
            catch (error) {
                console.error(`Health check failed for ${this.url}:`, error);
                return {
                    status: 'unhealthy',
                    score: 0,
                    details: error.message,
                    lastChecked: new Date(),
                };
            }
        });
    }
}
exports.ExternalApiHealthCheckService = ExternalApiHealthCheckService;
