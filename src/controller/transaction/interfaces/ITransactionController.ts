import { Request, Response } from 'express';

interface ITransactionController { 
    createTransaction(request: Request, response: Response): Promise<void>;
}

export default ITransactionController;
