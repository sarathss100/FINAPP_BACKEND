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
const mongoose_1 = __importDefault(require("mongoose"));
const dbConfig_1 = __importDefault(require("./dbConfig"));
class MongooseConnection {
    constructor(_config) {
        this._config = _config;
        this._isConnected = false;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isConnected) {
                try {
                    yield mongoose_1.default.connect(this._config._uri, {
                        dbName: this._config._dbName
                    });
                    this._isConnected = true;
                    console.log(`Connected to MongoDB Successfully!`);
                }
                catch (error) {
                    console.error(`Mongoose connection error:`, error);
                    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
                }
            }
            return mongoose_1.default;
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.connection.close();
                this._isConnected = false;
                console.log(`MongoDB disconnected`);
            }
            catch (error) {
                console.error(`MongoDB disconnection error:`, error);
                throw new Error(`Failed to disconnect from MongoDB: ${error.message}`);
            }
        });
    }
}
exports.default = new MongooseConnection(dbConfig_1.default);
