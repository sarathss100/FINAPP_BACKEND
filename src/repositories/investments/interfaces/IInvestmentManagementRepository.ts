
interface IInvestmentManagementRepository {
    removeAccount(accountId: string): Promise<boolean>;
}

export default IInvestmentManagementRepository;
