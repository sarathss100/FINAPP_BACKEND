import mongoose from "mongoose";

export interface IMongooseConnecton {
    connect(): Promise<typeof mongoose>;
}