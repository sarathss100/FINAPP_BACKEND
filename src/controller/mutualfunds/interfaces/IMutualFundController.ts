import { Request, Response } from 'express';

interface IMutualFundController { 
    syncNavData(request: Request, response: Response): Promise<void>;
    searchMutualFunds(request: Request, response: Response): Promise<void>;
}

export default IMutualFundController;
