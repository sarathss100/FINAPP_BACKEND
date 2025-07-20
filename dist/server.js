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
const app_1 = __importDefault(require("./app"));
const mongooseConnection_1 = __importDefault(require("./config/database/mongooseConnection"));
const socket_server_1 = require("sockets/socket.server");
const PORT = parseInt(process.env.PORT || '5000', 10);
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongooseConnection_1.default.connect();
            const server = app_1.default.listen(PORT, () => {
                console.log(`Server Successfully start on PORT ${PORT}`);
            });
            // Initialize Socket.IO
            (0, socket_server_1.setupSocketIO)(server);
            // Handle server errors
            server.on('error', (error) => {
                console.error(`Server failed to start on PORT ${PORT}:`, error.message);
                process.exit(1);
            });
            // shutdown
            process.on('SIGINT', () => __awaiter(this, void 0, void 0, function* () {
                console.log(`Shutting down the application....`);
                yield mongooseConnection_1.default.disconnect();
                process.exit(0);
            }));
        }
        catch (error) {
            console.error(`MongoDB Connection Failed:`, error instanceof Error ? error.message : error);
            process.exit(1);
        }
    });
})();
