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
const AccountsModel_1 = require("model/accounts/model/AccountsModel");
class AccountManagementRepository {
    constructor() { }
    ;
    static get instance() {
        if (!AccountManagementRepository._instance) {
            AccountManagementRepository._instance = new AccountManagementRepository();
        }
        return AccountManagementRepository._instance;
    }
    // Creates a new financial account in the database and returns the created account in `AccountDTO` format.
    addAccount(accountData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                // Check if an account with the same name and number already exists for this user
                const existingAccount = yield AccountsModel_1.AccountModel.findOne({
                    account_name: accountData.account_name,
                    account_number: accountData.account_number,
                    user_id: accountData.user_id
                });
                if (existingAccount) {
                    // Return the existing account instead of throwing error
                    return {
                        _id: (_a = existingAccount._id) === null || _a === void 0 ? void 0 : _a.toString(),
                        user_id: (_b = existingAccount.user_id) === null || _b === void 0 ? void 0 : _b.toString(),
                        account_name: existingAccount.account_name,
                        currency: existingAccount.currency,
                        description: existingAccount.description,
                        is_active: existingAccount.is_active,
                        created_by: existingAccount.created_by.toString(),
                        last_updated_by: (_c = existingAccount.last_updated_by) === null || _c === void 0 ? void 0 : _c.toString(),
                        account_type: existingAccount.account_type,
                        current_balance: existingAccount.current_balance,
                        institution: existingAccount.institution,
                        account_number: existingAccount.account_number,
                        account_subtype: existingAccount.account_subtype,
                        loan_type: existingAccount.loan_type,
                        interest_rate: existingAccount.interest_rate,
                        monthly_payment: existingAccount.monthly_payment,
                        due_date: existingAccount.due_date,
                        term_months: existingAccount.term_months,
                        investment_platform: existingAccount.investment_platform,
                        portfolio_value: existingAccount.portfolio_value,
                        location: existingAccount.location
                    };
                }
                // No duplicate found, proceed to create a new account
                const result = yield AccountsModel_1.AccountModel.create(accountData);
                // Return the newly created account
                const addedAccount = {
                    _id: (_d = result._id) === null || _d === void 0 ? void 0 : _d.toString(),
                    user_id: (_e = result.user_id) === null || _e === void 0 ? void 0 : _e.toString(),
                    account_name: result.account_name,
                    currency: result.currency,
                    description: result.description,
                    is_active: result.is_active,
                    created_by: result.created_by.toString(),
                    last_updated_by: (_f = result.last_updated_by) === null || _f === void 0 ? void 0 : _f.toString(),
                    account_type: result.account_type,
                    current_balance: result.current_balance,
                    institution: result.institution,
                    account_number: result.account_number,
                    account_subtype: result.account_subtype,
                    loan_type: result.loan_type,
                    interest_rate: result.interest_rate,
                    monthly_payment: result.monthly_payment,
                    due_date: result.due_date,
                    term_months: result.term_months,
                    investment_platform: result.investment_platform,
                    portfolio_value: result.portfolio_value,
                    location: result.location
                };
                return addedAccount;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    // Updates an existing account in the database and returns the updated account in IAccountDTO format.
    updateAccount(accountId, accountData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                // Perform the update operation
                const result = yield AccountsModel_1.AccountModel.findOneAndUpdate({ _id: accountId }, Object.assign({}, accountData), { new: true });
                // Handle case where no account is found
                if (!result) {
                    throw new Error('Account not found');
                }
                // Map the updated result to IAccountDTO format
                const updatedAccount = {
                    _id: (_a = result._id) === null || _a === void 0 ? void 0 : _a.toString(),
                    user_id: (_b = result === null || result === void 0 ? void 0 : result.user_id) === null || _b === void 0 ? void 0 : _b.toString(),
                    account_name: result.account_name,
                    currency: result.currency,
                    description: result.description,
                    is_active: result.is_active,
                    created_by: result.created_by.toString(),
                    last_updated_by: (_c = result.last_updated_by) === null || _c === void 0 ? void 0 : _c.toString(),
                    account_type: result.account_type,
                    current_balance: result.current_balance,
                    institution: result.institution,
                    account_number: result.account_number,
                    account_subtype: result.account_subtype,
                    loan_type: result.loan_type,
                    interest_rate: result.interest_rate,
                    monthly_payment: result.monthly_payment,
                    due_date: result.due_date,
                    term_months: result.term_months,
                    investment_platform: result.investment_platform,
                    portfolio_value: result.portfolio_value,
                    location: result.location
                };
                return updatedAccount;
            }
            catch (error) {
                console.error('Error updating Account:', error);
                throw new Error(error.message);
            }
        });
    }
    // Removes an existing account from the database.
    removeAccount(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                // Perform the deletion operation
                const result = yield AccountsModel_1.AccountModel.findOneAndDelete({ _id: accountId }, { new: true });
                // Handle case where no account is found
                if (!result) {
                    throw new Error('Account not found');
                }
                // Map the removed result to IAccountDTO format
                const removedAccount = {
                    _id: (_a = result._id) === null || _a === void 0 ? void 0 : _a.toString(),
                    user_id: (_b = result === null || result === void 0 ? void 0 : result.user_id) === null || _b === void 0 ? void 0 : _b.toString(),
                    account_name: result.account_name,
                    currency: result.currency,
                    description: result.description,
                    is_active: result.is_active,
                    created_by: result.created_by.toString(),
                    last_updated_by: (_c = result.last_updated_by) === null || _c === void 0 ? void 0 : _c.toString(),
                    account_type: result.account_type,
                    current_balance: result.current_balance,
                    institution: result.institution,
                    account_number: result.account_number,
                    account_subtype: result.account_subtype,
                    loan_type: result.loan_type,
                    interest_rate: result.interest_rate,
                    monthly_payment: result.monthly_payment,
                    due_date: result.due_date,
                    term_months: result.term_months,
                    investment_platform: result.investment_platform,
                    portfolio_value: result.portfolio_value,
                    location: result.location
                };
                return removedAccount;
            }
            catch (error) {
                console.error('Error updating Account:', error);
                throw new Error(error.message);
            }
        });
    }
    //Retrieves all accounts associated with a specific user from the database.
    getUserAccounts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Query the database to retrieve all accounts associated with the given `userId`.
                const result = yield AccountsModel_1.AccountModel.find({ user_id: userId });
                // it means no accounts were found for the given user, and an error is thrown.
                if (!result || result.length === 0) {
                    throw new Error('No accounts found for the specified user');
                }
                // Return the retrieved accounts as an array of `IAccountDTO` objects.
                return result;
            }
            catch (error) {
                // Log the error for debugging purposes.
                console.error('Error retrieving account details:', error);
                // Re-throw the error with a more descriptive message, ensuring the caller is informed of the issue.
                throw new Error(error.message);
            }
        });
    }
}
exports.default = AccountManagementRepository;
