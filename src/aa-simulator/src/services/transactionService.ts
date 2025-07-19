import { generateAccessToken } from "utils/auth/tokenUtils";
import TransactionService from "services/transaction/TransactionService";
import ITransactionService from "services/transaction/interfaces/ITransaction";
import { ITransactionDTO } from "dtos/transaction/TransactionDto";
import IUserDetails from "repositories/admin/interfaces/IUserDetails";

const transactionService: ITransactionService = TransactionService.instance;

export class TransactionGeneratorService {
    // private static BASE_URL = process.env.BASE_URL;
    // private static TIMEOUT = 15000;

    static async submitTransaction(transactionData: ITransactionDTO, user: IUserDetails) {

        try {
            const refinedUserData = {
                userId: user.userId,
                phoneNumber: user.phoneNumber,
                status: user.status,
                role: user.role,
                is2FA: user.is2FA || false,
            }

            const accessToken = await generateAccessToken(refinedUserData);

            transactionData.closing_balance = this.generateClosingBalance();

            await transactionService.createTransaction(accessToken, transactionData);

            // Submit to main application
            // const response = await axios.post(
            //     `${this.BASE_URL}/api/transactions`,
            //     transactionData,
            //     {
            //         headers: {
            //             'Authorization': `Bearer ${accessToken}`,
            //             'Content-Type': 'application/json',
            //             'X-Source': 'account-aggregator-simulator',
            //             'X-User-Agent': 'AA-Simulator/1.0'
            //         },
            //         timeout: this.TIMEOUT
            //     }
            // );

            console.log(`Transaction submitted successfully`);

        } catch (error) {
            console.error(`Failed to submit transaction`);
            throw error;
        }
    }

    private static generateClosingBalance(): number {
        const min = 5000;
        const max = 200000;
        return Math.floor(Math.random() * (max - min) + min);
    }
};