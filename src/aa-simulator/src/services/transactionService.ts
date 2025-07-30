import { generateAccessToken } from "../../../utils/auth/tokenUtils";
import TransactionService from "../../../services/transaction/TransactionService";
import ITransactionService from "../../../services/transaction/interfaces/ITransaction";
import { ITransactionDTO } from "../../../dtos/transaction/TransactionDto";
import IAuthUserDTO from "../../../dtos/auth/IAuthUserDTO";

const transactionService: ITransactionService = TransactionService.instance;

export class TransactionGeneratorService {

    static async submitTransaction(transactionData: ITransactionDTO, user: IAuthUserDTO) {

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