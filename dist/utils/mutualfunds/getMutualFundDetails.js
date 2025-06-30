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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MutualFundService_1 = __importDefault(require("services/mutualfunds/MutualFundService"));
const mutualFundService = MutualFundService_1.default.instance;
/**
 * Fetches detailed information about a specific mutual fund by its scheme code.
 *
 * This function acts as a wrapper around the `mutualFundService.getMutualFundDetails`
 * method, delegating the request and returning the matching mutual fund data.
 *
 * @param {string} schemCode - The unique identifier (scheme code) of the mutual fund.
 * @returns {Promise<IMutualFundDTO>} - A promise resolving to the mutual fund DTO.
 * @throws {Error} - Throws an error if the mutual fund cannot be retrieved.
 */
const getMutualFundDetails = function (schemCode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mutualFundDetails = yield mutualFundService.getMutualFundDetails(schemCode);
            return mutualFundDetails;
        }
        catch (error) {
            throw new Error(error.message || `Failed to fetch the Mutual Fund Details`);
        }
    });
};
exports.default = getMutualFundDetails;
