import { Request, Response } from 'express';

interface IMutualFundController { 
    createTransaction(request: Request, response: Response): Promise<void>;
}

export default IMutualFundController;
