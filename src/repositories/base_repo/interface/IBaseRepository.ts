import { FilterQuery, UpdateQuery } from "mongoose";

export default interface IBaseRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findOne(filter: FilterQuery<T>): Promise<T | null>; 
    findById(id: string): Promise<T | null>;
    find(filter: FilterQuery<T>): Promise<T[]>;
    findAll(): Promise<T[]>;
    updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null>;
    deleteOne(filter: FilterQuery<T>): Promise<T | null>;
}