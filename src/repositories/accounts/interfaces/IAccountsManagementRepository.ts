import IAccountDocument from '../../../model/accounts/interfaces/IAccounts';

export default interface IAccountsManagementRepository {
    addAccount(accountsData: Partial<IAccountDocument>): Promise<IAccountDocument>;
    updateAccount(accountId: string, accountData: Partial<IAccountDocument>): Promise<IAccountDocument>;
    removeAccount(accountId: string): Promise<IAccountDocument>;
    getUserAccounts(userId: string): Promise<IAccountDocument[]>;
}