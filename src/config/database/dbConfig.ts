import IMongooseConfig from './interfaces/IMongooseConfig';

class DbConfig implements IMongooseConfig {
    public readonly  _uri: string;
    public readonly _dbName: string;

    constructor() {
        this._uri = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017';
        this._dbName = process.env.DB_NAME || 'FinApp';
    }
}

export default new DbConfig();
