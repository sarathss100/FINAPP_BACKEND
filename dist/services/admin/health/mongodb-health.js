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
exports.MongoDbHealthCheckService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class MongoDbHealthCheckService {
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const state = mongoose_1.default.connection.readyState;
                const isConnected = state === 1; // 1 means connected
                const isConnecting = state === 2; // 2 means connecting
                const isDisconnected = state === 0; // 0 means disconnected
                return {
                    status: isConnected ? 'healthy' : isConnecting ? 'degraded' : isDisconnected ? 'unhealthy' : 'degraded',
                    score: isConnected ? 100 : isConnecting ? 50 : isDisconnected ? 0 : 50,
                    details: `MongoDB connection state: ${isConnected ? 'connected' : isConnecting ? 'connecting' : isDisconnected ? 'disconnected' : 'unknown'}`,
                    lastChecked: new Date(),
                };
            }
            catch (error) {
                return {
                    status: 'unhealthy',
                    score: 0,
                    details: `MongoDB connection state: disconnected, ${error.message}`,
                    lastChecked: new Date(),
                };
            }
        });
    }
}
exports.MongoDbHealthCheckService = MongoDbHealthCheckService;
