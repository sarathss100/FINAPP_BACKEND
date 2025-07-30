import { CronJob } from "cron";
import moment from "moment";
import IInvestmentService from "../services/investments/interfaces/IInvestmentService";
import InvestmentService from "../services/investments/InvestmentService";

const investmentService: IInvestmentService = InvestmentService.instance;

const updateStockPrice = new CronJob(
    '0 0 0 * * *', 
    async () => {
        console.log(`[CRON] Running daily stock price update at ${moment().format()}`);
        try {
            await investmentService.updateStockPrice();
            console.log(`[CRON] Stock price update completed successfully.`);
        } catch (error) {
            console.error(`[CRON] Failed to update stock prices`, error);
        }
    },
    null,  
    true, 
    'UTC' 
);

export default updateStockPrice;