import { IAccountDTO } from 'dtos/accounts/AccountsDTO';

interface IAccountsService {
    addAccount(accessToken: string, accountData: IAccountDTO): Promise<IAccountDTO>;
    updateAccount(accessToken: string, accountId: string, accountData: Partial<IAccountDTO>): Promise<IAccountDTO>;
    removeAccount(accountId: string): Promise<boolean>;
    getUserAccounts(accessToken: string): Promise<IAccountDTO[]>;
}

export default IAccountsService;
