import mongoose from 'mongoose';

interface IMongooseConnecton {
    connect(): Promise<typeof mongoose>;
}

export default IMongooseConnecton;