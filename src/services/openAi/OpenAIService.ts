import InvestmentManagementRepository from "repositories/investments/InvestmentManagementRepository";

const investmentRepo = InvestmentManagementRepository.instance;

async function getBotResponse(message: string, userId?: string): Promise<string> {
    const lower = message.toLowerCase().trim();

    // --- General Greetings ---
    if (['hi', 'hello', 'hey', 'howdy'].includes(lower)) {
        return "Hello! I'm your Finance Assistant. How can I help you today?";
    }

    // --- Balance & Net Worth ---
    if (lower.includes("balance") || lower.includes("net worth")) {
        if (!userId) return "I'd love to tell you about your balance — but I need your user ID!";
        
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [totalInvested, currentValue] = await Promise.all([
                investmentRepo.totalInvestment(userId),
                investmentRepo.currentTotalValue(userId)
            ]);
            const netWorth = currentValue;
            const profitLoss = await investmentRepo.getTotalReturns(userId);

            return `
                Your current net worth in investments is $${netWorth.toFixed(2)}.
                You've made a total profit/loss of $${profitLoss.toFixed(2)} so far.
            `;
        } catch (error) {
            console.error('Error fetching balance:', error);
            return "There was an issue retrieving your balance. Please try again later.";
        }
    }

    // --- Savings ---
    if (lower.includes("savings") || lower.includes("save money")) {
        return `
            To grow your savings:
            1. Set up automatic transfers to a separate savings account.
            2. Aim to save at least 20% of your income.
            3. Use budgeting tools to track spending.
        `;
    }

    // --- Investments ---
    if (lower.includes("invest") || lower.includes("investment")) {
        return `
            Investing helps grow your wealth over time. Here are some common options:
            - Stocks: Higher risk, higher reward.
            - Mutual Funds: Professionally managed, good for beginners.
            - Fixed Deposits: Safe, guaranteed returns.
            - Real Estate: Long-term value appreciation.
        `;
    }

    // --- Budgeting ---
    if (lower.includes("budget") || lower.includes("expenses")) {
        return `
            A solid budget starts with tracking income vs expenses. Try the 50/30/20 rule:
            - 50% Needs (rent, food, bills)
            - 30% Wants (entertainment, dining out)
            - 20% Savings & Debt Repayment
        `;
    }

    // --- Returns / Profit ---
    if (lower.includes("returns") || lower.includes("profit") || lower.includes("gain")) {
        if (!userId) return "I can check your returns if you log in.";

        try {
            const profitLoss = await investmentRepo.getTotalReturns(userId);
            return `
                Your total profit/loss across all investments is $${profitLoss.toFixed(2)}.
                This includes gains and losses from stocks, mutual funds, real estate, and more.
            `;
        } catch (error) {
            console.error('Error fetching returns:', error);
            return "There was an issue retrieving your returns. Please try again later.";
        }
    }

    // --- Help / Guidance ---
    if (lower.includes("help")) {
        return `
            I can help you with:
            - Understanding your investments
            - Planning a budget
            - Setting savings goals
            - Learning about different investment types
        `;
    }

    // --- Goals & Planning ---
    if (lower.includes("goal") || lower.includes("plan") || lower.includes("retirement") || lower.includes("house")) {
        return `
            Let's set a financial goal! For example:
            - Buying a house in 5 years
            - Retiring early
            - Paying off debt
        `;
    }

    // --- Default Response ---
    return `
        I'm here to help with personal finance topics like investing, budgeting, and savings.
        Ask me about:
        - Your investment performance
        - Budget planning
        - Saving strategies
        - Types of investments
        Or just say "help" to get started!
    `;
}

export default getBotResponse;