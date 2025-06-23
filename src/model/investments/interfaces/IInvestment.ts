import mongoose, { Document } from 'mongoose';

// Investment Types
export enum InvestmentType {
    STOCK = 'STOCK',
    MUTUAL_FUND = 'MUTUAL_FUND',
    BOND = 'BOND',
    PROPERTY = 'PROPERTY',
    BUSINESS = 'BUSINESS',
    FIXED_DEPOSIT = 'FIXED_DEPOSIT',
    EPFO = 'EPFO',
    GOLD = 'GOLD',
    PARKING_FUND = 'PARKING_FUND',
}


// Base Interface 
interface IBaseInvestment {
    name: string;
    icon?: string;
    initialAmount: number;
    currentValue?: number;
    totalProfitOrLoss?: number;
    relatedAccount?: mongoose.Types.ObjectId; 
    currency?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Type-Specific Interfaces 
export interface IStock extends IBaseInvestment {
    symbol: string;
    exchange?: string;
    purchaseDate: Date;
    quantity: number;
    purchasePricePerShare: number;
    currentPricePerShare?: number;
    dividendsReceived?: number;
}

export interface IMutualFund extends IBaseInvestment {
    fundHouse: string;
    folioNumber: string;
    schemeCode: string;
    units: number;
    purchasedNav: number;
    currentNav?: number;
    currentValue?: number;
}

export interface IBond extends IBaseInvestment {
    issuer: string;
    bondType: string;
    faceValue: number;
    couponRate: number;
    maturityDate: Date;
    purchaseDate: Date;
    currentValue?: number;
}

export interface IProperty extends IBaseInvestment {
    address: string;
    propertyType: string;
    purchaseDate: Date;
    purchasePrice: number;
    currentValue?: number;
    rentalIncome?: number;
}

export interface IBusiness extends IBaseInvestment {
    businessName: string;
    ownershipPercentage: number;
    investmentDate: Date;
    initialInvestment: number;
    currentValuation?: number;
    annualReturn?: number;
}

export interface IFixedDeposit extends IBaseInvestment {
    maturityDate: Date;
    interestRate: string;
    maturityAmount: string;
}

export interface IEPFO extends IBaseInvestment {
    accountNumber: string;
    epfNumber: string;
    employerContribution: number;
    employeeContribution: number;
    interestRate: number;
    maturityAmount?: number;
}

export interface IGold extends IBaseInvestment {
    goldForm: string; // e.g., jewelry, coins, bars
    goldType: string; // e.g., 24K, 22K
    weight: number; // in grams
    purchaseDate: Date;
    purchasePricePerGram: number;
    currentPricePerGram?: number;
}

export interface IParkingFund extends IBaseInvestment {
    fundType: string;
}

// Union Type for Details
export type InvestmentDetails =
    | IStock
    | IMutualFund
    | IBond
    | IProperty
    | IBusiness
    | IFixedDeposit
    | IEPFO
    | IGold
    | IParkingFund;

// Base Investment Document 
export interface IInvestmentDocument extends Document {
    userId: mongoose.Types.ObjectId;
    type: InvestmentType;
    details: InvestmentDetails;
}
