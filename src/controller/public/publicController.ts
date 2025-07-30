import IPublicService from '../../services/public/interfaces/IPublicService';
import IPublicController from './interfaces/IPublicController';
import { StatusCodes } from '../../constants/statusCodes';
import { SuccessMessages } from '../../constants/successMessages';
import { sendSuccessResponse } from '../../utils/responseHandler';
import { Request, Response } from 'express';
import { handleControllerError } from '../../utils/controllerUtils';

export default class PublicController implements IPublicController {
    public readonly _publicService: IPublicService;
    constructor(publicService: IPublicService) {
        this._publicService = publicService;
    }

    async getFaqs(request: Request, response: Response): Promise<void> {
        try {
            // Call the getall FAQ details in the publicService
            const faqDetails = await this._publicService.getFaqs();
            
            sendSuccessResponse(response, StatusCodes.OK, SuccessMessages.FAQ_FETCHED_SUCCESSFULLY, { faqDetails });
        } catch (error) {
            handleControllerError(response, error);
        }
    }
}
