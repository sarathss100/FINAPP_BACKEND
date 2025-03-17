import mongoose from 'mongoose';
import IMongooseConfig from './interfaces/IMongooseConfig';
import IMongooseConnecton from './interfaces/IMongooseConnection';
import dbConfig from './dbConfig';

class MongooseConnection implements IMongooseConnecton {
    private _isConnected: boolean = false;

    constructor(private _config: IMongooseConfig) {}

    async connect(): Promise<typeof mongoose> {
        if (!this._isConnected) {
            try {
                await mongoose.connect(this._config._uri, {
                    dbName: this._config._dbName
                });
                this._isConnected = true;
                console.log(`Connected to MongoDB Successfully!`);
            } catch (error) {
                console.error(`Mongoose connection error:`, error);
                throw new Error(`Failed to connect to MongoDB: ${(error as Error).message}`);
            }
        }
        return mongoose;
    }
    
    async disconnect(): Promise<void> {
        try {
            await mongoose.connection.close();
            this._isConnected = false;
            console.log(`MongoDB disconnected`);
        } catch (error) {
            console.error(`MongoDB disconnection error:`, error);
            throw new Error(`Failed to disconnect from MongoDB: ${(error as Error).message}`);
        }
    }
}

export default new MongooseConnection(dbConfig);
