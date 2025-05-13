import { IAccountDTO } from 'dtos/accounts/AccountsDTO';

interface IAccountsService {
    addAccount(accessToken: string, accountData: IAccountDTO): Promise<IAccountDTO>;
    updateAccount(accessToken: string, accountId: string, accountData: Partial<IAccountDTO>): Promise<IAccountDTO>;
    removeAccount(accountId: string): Promise<boolean>;
    getUserAccounts(accessToken: string): Promise<IAccountDTO[]>;
    getTotalBalance(accessToken: string): Promise<number>;
    getTotalBankBalance(accessToken: string): Promise<number>;
    getTotalDebt(accessToken: string): Promise<number>;
    getTotalInvestment(accessToken: string): Promise<number>;
}

export default IAccountsService;
