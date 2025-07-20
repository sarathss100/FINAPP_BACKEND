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
const axios_1 = __importDefault(require("axios"));
const NAV_URL = process.env.MUTUAL_FUND_URL || `https://www.amfiindia.com/spages/NAVAll.txt `;
const fetchNavData = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(NAV_URL);
            const lines = response.data.split('\n');
            const funds = [];
            for (const line of lines) {
                const parts = line.split(';');
                if (parts.length >= 5) {
                    if (parts[0].trim() === 'Scheme Code')
                        continue;
                    const fund = {
                        scheme_code: parts[0].trim(),
                        scheme_name: parts[3].trim(),
                        net_asset_value: Number(parts[4].trim()) || 0,
                        date: new Date(parts[7] || parts[5]),
                    };
                    funds.push(fund);
                }
            }
            return funds;
        }
        catch (error) {
            console.error(`Error fetching NAV data:`, error);
            return [];
        }
    });
};
exports.default = fetchNavData;
