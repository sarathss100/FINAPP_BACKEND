import mongoose from "mongoose";
import { IMongooseConfig } from "./interfaces/IMongooseConfig";
import { IMongooseConnecton } from "./interfaces/IMongooseConnection";
import dbConfig from "./dbConfig";

class MongooseConnection implements IMongooseConnecton {
    private isConnected: boolean = false;

    constructor(private config: IMongooseConfig) {}

    async connect(): Promise<typeof mongoose> {
        if (!this.isConnected) {
            try {
                await mongoose.connect(this.config.uri, {
                    dbName: this.config.dbName
                });
                this.isConnected = true;
                console.log(`Connected to MongoDB Successfully!`);
            } catch (error) {
                console.error(`Mongoose connection error:`, error);
                throw Error;
            }
        }
        return mongoose;
    }
}

export default new MongooseConnection(dbConfig);