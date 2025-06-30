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
const AppError_1 = require("error/AppError");
const errorMessages_1 = require("constants/errorMessages");
const statusCodes_1 = require("constants/statusCodes");
class PublicService {
    constructor(publicRepository) {
        this._publicRepository = publicRepository;
    }
    /**
     * Fetches all published and non-deleted FAQ entries from the database.
     *
     * This method retrieves FAQ entries by calling the `getFaqs` method of the public repository.
     * It ensures that only valid FAQ entries are returned. If no FAQs are found or an error occurs,
     * appropriate exceptions are thrown.
     *
     * @returns A promise that resolves to an array of FAQ entries (`IFaq[]`).
     * @throws {ServerError} If no FAQs are found or the fetch operation fails.
     * @throws {AppError} If any application-specific error occurs during the process.
     * @throws {Error} If an unexpected error occurs.
     */
    getFaqs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the public repository method to fetch all published and non-deleted FAQ entries
                const faqDetails = yield this._publicRepository.getFaqs();
                // Validate the result; throw an error if no FAQs were found
                if (!faqDetails || faqDetails.length === 0) {
                    throw new AppError_1.ServerError(errorMessages_1.ErrorMessages.FAILED_TO_FETCH_FAQS, statusCodes_1.StatusCodes.BAD_REQUEST);
                }
                // Return the fetched FAQ entries
                return faqDetails;
            }
            catch (error) {
                // Re-throw the error if it's an instance of AppError (custom application error)
                if (error instanceof AppError_1.AppError) {
                    throw error;
                }
                else {
                    // Re-throw unexpected errors for further handling
                    throw error;
                }
            }
        });
    }
}
exports.default = PublicService;
