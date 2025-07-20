"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = require("constants/statusCodes");
const successMessages_1 = require("constants/successMessages");
const errorMessages_1 = require("constants/errorMessages");
const responseHandler_1 = require("utils/responseHandler");
const AppError_1 = require("error/AppError");
class PublicController {
    constructor(publicService) {
        this._publicService = publicService;
    }
    getFaqs(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the getall FAQ details in the publicService
                const faqDetails = yield this._publicService.getFaqs();
                if (faqDetails) {
                    (0, responseHandler_1.sendSuccessResponse)(response, statusCodes_1.StatusCodes.OK, successMessages_1.SuccessMessages.FAQ_FETCHED_SUCCESSFULLY, { faqDetails });
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.BAD_REQUEST, errorMessages_1.ErrorMessages.FAILED_TO_ADD_THE_FAQ);
                }
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    (0, responseHandler_1.sendErrorResponse)(response, error.statusCode, error.message);
                }
                else {
                    (0, responseHandler_1.sendErrorResponse)(response, statusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessages_1.ErrorMessages.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
}
exports.default = PublicController;
