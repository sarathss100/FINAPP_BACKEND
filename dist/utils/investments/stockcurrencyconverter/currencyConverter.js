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
exports.getExchangeRate = void 0;
const axios_1 = __importDefault(require("axios"));
const getExchangeRate = function (fromCurrency_1) {
    return __awaiter(this, arguments, void 0, function* (fromCurrency, toCurrency = 'INR', amount) {
        if (fromCurrency === toCurrency)
            return 1.0;
        try {
            const apiKey = process.env.EXCHANGE_RATE_API;
            const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;
            const res = yield axios_1.default.get(url);
            console.log(res.data);
            return parseFloat(res.data.conversion_result);
        }
        catch (error) {
            console.error(error.message || `Failed to fetch exchange rate for ${fromCurrency} → INR`);
            return 1.0;
        }
    });
};
exports.getExchangeRate = getExchangeRate;
