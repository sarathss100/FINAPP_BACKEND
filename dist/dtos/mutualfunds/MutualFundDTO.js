"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutualfundDTOSchema = void 0;
const zod_1 = require("zod");
exports.mutualfundDTOSchema = zod_1.z.object({
    scheme_code: zod_1.z.string().min(1, { message: `Scheme code is required` }),
    scheme_name: zod_1.z.string().min(1, { message: `Scheme name is required ` }),
    net_asset_value: zod_1.z.number({ invalid_type_error: `Net Asset Value must be a number` }),
    date: zod_1.z.date().refine(date => !isNaN(date.getTime()), {
        message: `Invalid date format`,
    }),
});
