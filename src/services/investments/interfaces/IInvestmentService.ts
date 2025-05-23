
interface IInvestmentService {
    removeAccount(accountId: string): Promise<boolean>;
}

export default IInvestmentService;

