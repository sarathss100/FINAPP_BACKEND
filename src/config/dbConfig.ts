import { IMongooseConfig } from "./interfaces/IMongooseConfig";
import dotenv from 'dotenv';

// Load environment variables 
dotenv.config();

class DbConfig implements IMongooseConfig {
    public readonly  uri: string;
    public readonly dbName: string;

    constructor() {
        this.uri = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017';
        this.dbName = process.env.DB_NAME || 'FinApp';
    }
}

export default new DbConfig();