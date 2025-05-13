import { IAccountDTO } from 'dtos/accounts/AccountsDTO';

interface IAccountsManagementRepository {
    addAccount(accountsData: IAccountDTO): Promise<IAccountDTO>;
    updateAccount(accountId: string, accountData: Partial<IAccountDTO>): Promise<IAccountDTO>;
    removeAccount(accountId: string): Promise<boolean>;
    getUserAccounts(userId: string): Promise<IAccountDTO[]>;
}

export default IAccountsManagementRepository;
