"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DbConfig {
    constructor() {
        this._uri = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017';
        this._dbName = process.env.DB_NAME || 'FinApp';
    }
}
exports.default = new DbConfig();
