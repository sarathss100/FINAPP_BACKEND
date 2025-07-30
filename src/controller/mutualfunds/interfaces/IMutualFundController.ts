import { Request, Response } from 'express';

export default interface IMutualFundController { 
    syncNavData(request: Request, response: Response): Promise<void>;
    searchMutualFunds(request: Request, response: Response): Promise<void>;
    getMutualFundDetails(request: Request, response: Response): Promise<void>;
}
