"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectCurrencyFromExchange = exports.extractCountry = void 0;
const exchangeToCurrency_json_1 = __importDefault(require("./exchangeToCurrency.json"));
const extractCountry = function (exchangeName) {
    var _a;
    const patterns = [
        /united\s+states/i,
        /us|usa/i,
        /united\s+kingdom/i,
        /uk/i,
        /germany|deu|de|frankfurt|xetra/i,
        /india|in|national\s+stock\s+exchange|nse|bse/i,
        /canada|tsx|tsv|venture/i,
        /japan|jp|tokyo|tse/i,
        /china|cn|shanghai|szse|sse|shenzhen/i,
        /hong\s+kong|hkg|hse/i,
        /south\s+korea|kr|kospi|korea/i,
        /australia|asx|aus/i,
        /singapore|sgx|singaporean/i,
        /france|euronext|paris|fr/i,
        /switzerland|ch|swe|six/i,
        /spain|madrid|es|sp/i,
        /italy|milan|it|itl/i,
        /brazil|bovespa|br/i,
        /russia|moex|ru/i,
        /saudi\s+arabia|tadawul|sa/i,
        /uae|dubai|abu\s+dhabi|ae/i
    ];
    for (const pattern of patterns) {
        if (pattern.test(exchangeName)) {
            return ((_a = pattern.toString().match(/\/(.*)\//i)) === null || _a === void 0 ? void 0 : _a[1]) || null;
        }
    }
    return null;
};
exports.extractCountry = extractCountry;
const detectCurrencyFromExchange = function (exchangeName) {
    const normalized = exchangeName.toUpperCase();
    if (exchangeToCurrency_json_1.default[normalized]) {
        return exchangeToCurrency_json_1.default[normalized];
    }
    const country = (0, exports.extractCountry)(exchangeName);
    if (!country)
        return 'USD';
    switch (country.toLowerCase()) {
        case 'united states':
        case 'us':
            return 'USD';
        case 'united kingdom':
        case 'uk':
            return 'GBP';
        case 'germany':
            return 'EUR';
        case 'canada':
            return 'CAD';
        case 'india':
            return 'INR';
        case 'china':
            return 'CNY';
        case 'japan':
            return 'JPY';
        case 'south korea':
        case 'korea':
            return 'KRW';
        case 'singapore':
            return 'SGD';
        case 'france':
        case 'paris':
            return 'EUR';
        case 'switzerland':
            return 'CHF';
        default:
            return 'USD';
    }
};
exports.detectCurrencyFromExchange = detectCurrencyFromExchange;
