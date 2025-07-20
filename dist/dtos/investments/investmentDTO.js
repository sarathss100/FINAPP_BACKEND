"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVESTMENT_TYPES = exports.InvestmentDTOSchema = exports.ParkingFundDTOSchema = exports.GoldDTOSchema = exports.EPFODTOSchema = exports.FixedDepositDTOSchema = exports.BusinessDTOSchema = exports.PropertyDTOSchema = exports.BondDTOSchema = exports.MutualFundDTOSchema = exports.StockDTOSchema = exports.BaseInvestmentDTOSchema = void 0;
const zod_1 = require("zod");
exports.BaseInvestmentDTOSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Name is required' }),
    icon: zod_1.z.string().optional(),
    initialAmount: zod_1.z.number({ invalid_type_error: 'Amount must be a number' }).positive('Amount must be greater than zero'),
    currentValue: zod_1.z.number({ invalid_type_error: 'Amount must be a number' }).optional(),
    totalProfitOrLoss: zod_1.z.number({ invalid_type_error: 'Amount must be a number' }).optional(),
    relatedAccount: zod_1.z.string().optional(),
    currency: zod_1.z.string().optional().default('INR'),
    notes: zod_1.z.string().optional(),
    createdAt: zod_1.z.coerce.date().optional(),
    updatedAt: zod_1.z.coerce.date().optional(),
});
exports.StockDTOSchema = exports.BaseInvestmentDTOSchema.extend({
    type: zod_1.z.literal('STOCK'),
    symbol: zod_1.z.string().min(1, 'Symbol is required'),
    exchange: zod_1.z.string().optional(),
    purchaseDate: zod_1.z.coerce.date(),
    quantity: zod_1.z.number().positive('Quantity must be greater than zero'),
    purchasePricePerShare: zod_1.z.number().positive('Purchase price per share must be greater than zero'),
    currentPricePerShare: zod_1.z.number().optional(),
    dividendsReceived: zod_1.z.number().optional(),
}).passthrough();
exports.MutualFundDTOSchema = exports.BaseInvestmentDTOSchema.extend({
    type: zod_1.z.literal('MUTUAL_FUND'),
    fundHouse: zod_1.z.string().min(1, 'Fund house is required'),
    folioNumber: zod_1.z.string().min(1, 'Folio number is required'),
    schemeCode: zod_1.z.string().min(1, 'Scheme code is required'),
    units: zod_1.z.number().positive('Units must be greater than zero'),
    purchasedNav: zod_1.z.number().positive('Purchased NAV must be greater than zero'),
    currentNav: zod_1.z.number().optional(),
    currentValue: zod_1.z.number().optional()
}).passthrough();
exports.BondDTOSchema = exports.BaseInvestmentDTOSchema.extend({
    type: zod_1.z.literal('BOND'),
    issuer: zod_1.z.string().min(1, 'Issuer is required'),
    bondType: zod_1.z.string().min(1, 'Bond type is required'),
    faceValue: zod_1.z.number().positive('Face value must be greater than zero'),
    couponRate: zod_1.z.number().positive('Coupon rate must be greater than zero'),
    maturityDate: zod_1.z.coerce.date(),
    purchaseDate: zod_1.z.coerce.date(),
    currentValue: zod_1.z.number().optional()
}).passthrough();
exports.PropertyDTOSchema = exports.BaseInvestmentDTOSchema.extend({
    type: zod_1.z.literal('PROPERTY'),
    address: zod_1.z.string().min(1, 'Address is required'),
    propertyType: zod_1.z.string().min(1, 'Property type is required'),
    purchaseDate: zod_1.z.coerce.date(),
    purchasePrice: zod_1.z.number().positive('Purchase price must be greater than zero'),
    currentValue: zod_1.z.number().optional(),
    rentalIncome: zod_1.z.number().optional()
}).passthrough();
exports.BusinessDTOSchema = exports.BaseInvestmentDTOSchema.extend({
    type: zod_1.z.literal('BUSINESS'),
    businessName: zod_1.z.string().min(1, 'Business name is required'),
    ownershipPercentage: zod_1.z.number().positive('Ownership percentage must be greater than zero'),
    investmentDate: zod_1.z.coerce.date(),
    initialInvestment: zod_1.z.number().positive('Initial investment must be greater than zero'),
    currentValuation: zod_1.z.number().optional(),
    annualReturn: zod_1.z.number().optional()
}).passthrough();
exports.FixedDepositDTOSchema = exports.BaseInvestmentDTOSchema.extend({
    type: zod_1.z.literal('FIXED_DEPOSIT'),
    maturityDate: zod_1.z.string(),
    interestRate: zod_1.z.number().optional(),
    maturityAmount: zod_1.z.number().optional()
}).passthrough();
exports.EPFODTOSchema = exports.BaseInvestmentDTOSchema.extend({
    type: zod_1.z.literal('EPFO'),
    accountNumber: zod_1.z.string().min(1, 'Account number is required'),
    epfNumber: zod_1.z.string().min(1, 'EPF number is required'),
    employerContribution: zod_1.z.number().positive('Employer contribution must be greater than zero'),
    employeeContribution: zod_1.z.number().positive('Employee contribution must be greater than zero'),
    interestRate: zod_1.z.number().positive('Interest rate must be greater than zero'),
    maturityAmount: zod_1.z.number().optional()
}).passthrough();
exports.GoldDTOSchema = exports.BaseInvestmentDTOSchema.extend({
    type: zod_1.z.literal('GOLD'),
    goldForm: zod_1.z.string().min(1, 'Gold form is required'),
    goldType: zod_1.z.string().min(1, 'Gold type is required'),
    weight: zod_1.z.number().positive('Weight must be greater than zero'),
    purchaseDate: zod_1.z.string(),
    purchasePricePerGram: zod_1.z.number().positive('Purchase price per gram must be greater than zero'),
    currentPricePerGram: zod_1.z.number().optional()
}).passthrough();
exports.ParkingFundDTOSchema = exports.BaseInvestmentDTOSchema.extend({
    type: zod_1.z.literal('PARKING_FUND'),
    fundType: zod_1.z.string().min(1, 'Fund type is required'),
}).passthrough();
// Use discriminatedUnion for better error messages and type inference
exports.InvestmentDTOSchema = zod_1.z.discriminatedUnion('type', [
    exports.StockDTOSchema,
    exports.MutualFundDTOSchema,
    exports.BondDTOSchema,
    exports.PropertyDTOSchema,
    exports.BusinessDTOSchema,
    exports.FixedDepositDTOSchema,
    exports.EPFODTOSchema,
    exports.GoldDTOSchema,
    exports.ParkingFundDTOSchema
]);
// Export the investment types for reference
exports.INVESTMENT_TYPES = [
    'STOCK',
    'MUTUAL_FUND',
    'BOND',
    'PROPERTY',
    'BUSINESS',
    'FIXED_DEPOSIT',
    'EPFO',
    'GOLD',
    'PARKING_FUND'
];
