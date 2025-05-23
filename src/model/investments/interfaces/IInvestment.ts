import mongoose, { Document } from 'mongoose';

// Investment Types
export enum InvestmentType {
    STOCK = 'Stock',
    MUTUAL_FUND = 'Mutual Fund',
    BOND = 'Bond',
    PROPERTY = 'Property',
    BUSINESS = 'Business',
    FIXED_DEPOSIT = 'Fixed Deposit',
    EPFO = 'EPFO',
    GOLD = 'Gold',
    PARKING_FUND = 'Parking Fund',
    OTHER  = 'Other',
}

// Base Interface 
interface IBaseInvestment {
    name: string;
    icon?: string;
    amount: number;
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
    bank: string;
    account_number: string;
    deposit_number: string;
    maturity_date: Date;
    interest_rate: number;
    maturity_amount?: number;
}

export interface IEPFO extends IBaseInvestment {
    account_number: string;
    epf_number: string;
    employer_contribution: number;
    employee_contribution: number;
    interest_rate: number;
    maturity_amount?: number;
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
    linkedAccountId: mongoose.Types.ObjectId;
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
