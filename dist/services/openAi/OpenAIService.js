"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvestmentManagementRepository_1 = __importDefault(require("repositories/investments/InvestmentManagementRepository"));
const investmentRepo = InvestmentManagementRepository_1.default.instance;
function getBotResponse(message, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const lower = message.toLowerCase().trim();
        // --- General Greetings ---
        if (['hi', 'hello', 'hey', 'howdy'].includes(lower)) {
            return "Hello! I'm your Finance Assistant. How can I help you today?";
        }
        // --- Balance & Net Worth ---
        if (lower.includes("balance") || lower.includes("net worth")) {
            if (!userId)
                return "I'd love to tell you about your balance — but I need your user ID!";
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [totalInvested, currentValue] = yield Promise.all([
                    investmentRepo.totalInvestment(userId),
                    investmentRepo.currentTotalValue(userId)
                ]);
                const netWorth = currentValue;
                const profitLoss = yield investmentRepo.getTotalReturns(userId);
                return `
                Your current net worth in investments is $${netWorth.toFixed(2)}.
                You've made a total profit/loss of $${profitLoss.toFixed(2)} so far.
            `;
            }
            catch (error) {
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
            if (!userId)
                return "I can check your returns if you log in.";
            try {
                const profitLoss = yield investmentRepo.getTotalReturns(userId);
                return `
                Your total profit/loss across all investments is $${profitLoss.toFixed(2)}.
                This includes gains and losses from stocks, mutual funds, real estate, and more.
            `;
            }
            catch (error) {
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
        // --- NEW: Debt Management ---
        if (lower.includes("debt") || lower.includes("loan") || lower.includes("credit card")) {
            return `
            Managing debt effectively:
            - List all debts with interest rates and balances
            - Use the debt avalanche method: pay minimums on all, extra on highest interest rate
            - Consider debt consolidation if it lowers your overall interest rate
            - Avoid taking on new debt while paying off existing ones
            - Emergency fund first, then aggressive debt payoff
        `;
        }
        // --- NEW: Emergency Fund ---
        if (lower.includes("emergency fund") || lower.includes("emergency savings")) {
            return `
            Your emergency fund should cover 3-6 months of essential expenses:
            - Start with $1,000 as a mini emergency fund
            - Gradually build to cover monthly expenses (rent, food, utilities, insurance)
            - Keep it in a high-yield savings account for easy access
            - Only use for true emergencies, not planned expenses
            - Replenish immediately after using it
        `;
        }
        // --- NEW: Insurance ---
        if (lower.includes("insurance") || lower.includes("protect")) {
            return `
            Essential insurance coverage:
            - Health Insurance: Protects against medical expenses
            - Term Life Insurance: If you have dependents (10-12x annual income)
            - Disability Insurance: Protects your income if you can't work
            - Auto Insurance: Required by law in most places
            - Renters/Homeowners: Protects your belongings and property
            Don't over-insure or buy unnecessary policies like whole life insurance.
        `;
        }
        // --- NEW: Tax Planning ---
        if (lower.includes("tax") || lower.includes("taxes") || lower.includes("deduction")) {
            return `
            Smart tax strategies:
            - Maximize retirement contributions (401k, IRA) for tax deductions
            - Keep records of all deductible expenses
            - Consider tax-loss harvesting in investment accounts
            - Use HSA if available (triple tax advantage)
            - Plan major purchases and income timing around tax implications
            - Consult a tax professional for complex situations
        `;
        }
        // --- NEW: Retirement Planning ---
        if (lower.includes("401k") || lower.includes("ira") || lower.includes("retire")) {
            return `
            Retirement planning basics:
            - Start early to benefit from compound interest
            - Contribute enough to get full employer 401k match (free money!)
            - Max out tax-advantaged accounts: 401k, IRA, Roth IRA
            - Rule of thumb: Save 10-15% of income for retirement
            - Consider target-date funds for automatic diversification
            - Review and rebalance annually
        `;
        }
        // --- NEW: Investment Education ---
        if (lower.includes("stock market") || lower.includes("how to invest") || lower.includes("beginner")) {
            return `
            Investment basics for beginners:
            - Start with index funds or ETFs for instant diversification
            - Don't try to time the market - invest consistently
            - Understand your risk tolerance and time horizon
            - Dollar-cost averaging reduces timing risk
            - Keep investment fees low (expense ratios under 0.5%)
            - Never invest money you'll need within 5 years
            - Diversify across asset classes and geographies
        `;
        }
        // --- NEW: Credit Score ---
        if (lower.includes("credit score") || lower.includes("credit report")) {
            return `
            Improving your credit score:
            - Pay all bills on time (35% of your score)
            - Keep credit utilization below 30%, ideally under 10%
            - Don't close old credit cards (length of credit history matters)
            - Monitor your credit report for errors
            - Limit new credit applications
            - Consider becoming an authorized user on someone else's good account
            - Be patient - credit improvement takes time
        `;
        }
        // --- NEW: Side Income ---
        if (lower.includes("side hustle") || lower.includes("extra income") || lower.includes("make money")) {
            return `
            Ideas for extra income:
            - Freelancing in your skill area (writing, design, programming)
            - Selling items you no longer need
            - Gig economy work (delivery, rideshare)
            - Online tutoring or teaching
            - Renting out a spare room
            - Creating and selling digital products
            Remember: Track all income for tax purposes and reinvest earnings wisely!
        `;
        }
        // --- NEW: Money Mindset ---
        if (lower.includes("money mindset") || lower.includes("financial stress") || lower.includes("money anxiety")) {
            return `
            Developing a healthy money mindset:
            - Money is a tool, not a measure of self-worth
            - Focus on progress, not perfection
            - Automate good financial habits to reduce decision fatigue
            - Celebrate small wins along your financial journey
            - Learn continuously - financial education is ongoing
            - Don't compare your financial situation to others
            - Seek support when needed - financial stress is common and manageable
        `;
        }
        // --- NEW: Young Adults / College ---
        if (lower.includes("college") || lower.includes("student") || lower.includes("young adult")) {
            return `
            Financial tips for young adults:
            - Build credit responsibly with a student credit card
            - Apply for scholarships and grants to reduce student loans
            - Start investing early, even with small amounts
            - Live below your means - avoid lifestyle inflation
            - Learn to cook and budget for groceries
            - Consider the ROI of your education and career choices
            - Build good financial habits now while expenses are lower
        `;
        }
        // --- NEW: Family Finance ---
        if (lower.includes("family") || lower.includes("kids") || lower.includes("children")) {
            return `
            Managing family finances:
            - Increase your emergency fund to 6+ months with dependents
            - Get adequate life and disability insurance
            - Start saving for children's education early (529 plans)
            - Teach kids about money through age-appropriate activities
            - Budget for increased expenses: healthcare, childcare, activities
            - Update your will and beneficiaries
            - Consider the costs before having more children
        `;
        }
        // --- NEW: Home Buying ---
        if (lower.includes("buy house") || lower.includes("mortgage") || lower.includes("home buying")) {
            return `
            Home buying preparation:
            - Save 20% down payment to avoid PMI
            - Ensure housing costs don't exceed 28% of gross income
            - Check your credit score and clean up any issues
            - Get pre-approved for a mortgage before house hunting
            - Factor in closing costs, moving expenses, and maintenance
            - Don't buy the most expensive house you qualify for
            - Consider the total cost of homeownership, not just the monthly payment
        `;
        }
        // --- NEW: Market Volatility ---
        if (lower.includes("market crash") || lower.includes("recession") || lower.includes("volatile")) {
            return `
            During market volatility:
            - Stay calm and stick to your long-term plan
            - Don't panic sell - you only lose money when you sell
            - Consider this a buying opportunity if you have cash
            - Review your emergency fund - make sure it's adequate
            - Focus on what you can control: expenses, savings rate, debt
            - Market downturns are normal and temporary
            - Continue regular investments (dollar-cost averaging)
        `;
        }
        // --- NEW: Financial Tools ---
        if (lower.includes("apps") || lower.includes("tools") || lower.includes("software")) {
            return `
            Helpful financial tools:
            - Budgeting: Mint, YNAB, Personal Capital
            - Investment tracking: Your brokerage app, Yahoo Finance
            - Credit monitoring: Credit Karma, Annual Credit Report
            - Expense tracking: Splitwise, Expensify
            - Savings goals: Automatic transfers, separate savings accounts
            - Net worth tracking: Spreadsheets or Personal Capital
            Choose tools that you'll actually use consistently!
        `;
        }
        // --- NEW: Inflation & Economic Concerns ---
        if (lower.includes("inflation") || lower.includes("economy") || lower.includes("rising prices")) {
            return `
            Dealing with inflation:
            - Invest in assets that historically outpace inflation (stocks, real estate)
            - Consider I-bonds for inflation-protected savings
            - Focus on increasing your income through skills/career advancement
            - Review your budget regularly and cut unnecessary expenses
            - Avoid keeping too much cash long-term
            - Look for ways to reduce major expenses (refinance, negotiate bills)
            - Remember: moderate inflation is normal in a healthy economy
        `;
        }
        // --- NEW: Crypto & Alternative Investments ---
        if (lower.includes("crypto") || lower.includes("bitcoin") || lower.includes("ethereum") || lower.includes("nft")) {
            return `
        Cryptocurrency considerations:
        - Only invest what you can afford to lose completely
        - Crypto should be max 5-10% of your investment portfolio
        - Understand the technology and risks before investing
        - Use reputable exchanges with strong security measures
        - Don't FOMO into trends - stick to established coins if investing
        - Consider crypto as speculation, not traditional investment
        - Be prepared for extreme volatility
        - Keep your private keys secure and backed up
    `;
        }
        // --- NEW: Career & Salary ---
        if (lower.includes("salary") || lower.includes("raise") || lower.includes("career") || lower.includes("job change")) {
            return `
        Maximizing your earning potential:
        - Research market rates for your role and location
        - Document your achievements and impact for raise discussions
        - Invest in skills that increase your market value
        - Consider job changes every 2-3 years for salary growth
        - Negotiate salary, not just base pay (benefits, PTO, equity)
        - Build multiple income streams to reduce single-job dependency
        - Network consistently, not just when job hunting
        - Consider remote work opportunities for higher pay markets
    `;
        }
        // --- NEW: Small Business & Entrepreneurship ---
        if (lower.includes("business") || lower.includes("startup") || lower.includes("entrepreneur") || lower.includes("self employed")) {
            return `
        Financial planning for business owners:
        - Separate personal and business finances completely
        - Build a larger emergency fund (6-12 months expenses)
        - Set aside 25-30% of income for taxes quarterly
        - Consider SEP-IRA or Solo 401k for retirement savings
        - Get business insurance and liability protection
        - Track all business expenses for tax deductions
        - Reinvest profits wisely - not all revenue is take-home pay
        - Plan for irregular income with conservative budgeting
    `;
        }
        // --- NEW: Elder Care & Aging Parents ---
        if (lower.includes("aging parents") || lower.includes("elder care") || lower.includes("medicare") || lower.includes("nursing home")) {
            return `
        Planning for aging parents' care:
        - Have open conversations about their financial situation
        - Understand Medicare and supplemental insurance options
        - Research long-term care insurance costs and benefits
        - Consider adult day care vs. in-home care vs. assisted living costs
        - Look into veterans' benefits if applicable
        - Plan for potential family financial support needed
        - Organize important documents and legal arrangements
        - Consider the emotional and financial impact on your own retirement
    `;
        }
        // --- NEW: Divorce & Major Life Changes ---
        if (lower.includes("divorce") || lower.includes("separation") || lower.includes("life change") || lower.includes("major expense")) {
            return `
        Managing finances during major life changes:
        - Create separate emergency funds and accounts
        - Update beneficiaries on all accounts and insurance
        - Review and potentially revise your budget completely
        - Consider credit implications and joint account responsibilities
        - Reassess insurance needs and coverage
        - Update estate planning documents
        - Seek professional help for complex financial situations
        - Focus on financial stability before major new commitments
    `;
        }
        // --- NEW: Healthcare Costs ---
        if (lower.includes("medical bills") || lower.includes("healthcare") || lower.includes("hsa") || lower.includes("medical expenses")) {
            return `
        Managing healthcare costs:
        - Maximize HSA contributions (triple tax advantage)
        - Understand your insurance deductibles and out-of-pocket maximums
        - Always ask for itemized bills and review for errors
        - Negotiate payment plans for large medical bills
        - Consider generic medications when possible
        - Use in-network providers to minimize costs
        - Keep receipts for all medical expenses (tax deductions)
        - Research healthcare sharing ministries as alternative options
    `;
        }
        // --- NEW: Education & Student Loans ---
        if (lower.includes("student loans") || lower.includes("education debt") || lower.includes("loan forgiveness") || lower.includes("refinance")) {
            return `
        Managing student loan debt:
        - Explore income-driven repayment plans if struggling
        - Research loan forgiveness programs for your profession
        - Consider refinancing if you have good credit and steady income
        - Pay extra toward principal when possible
        - Don't default - contact servicer if having trouble paying
        - Understand tax implications of forgiven debt
        - Consider public service loan forgiveness if eligible
        - Balance aggressive payoff with other financial goals
    `;
        }
        // --- NEW: Travel & Lifestyle ---
        if (lower.includes("travel") || lower.includes("vacation") || lower.includes("lifestyle") || lower.includes("experiences")) {
            return `
        Budgeting for travel and experiences:
        - Create a dedicated travel savings account
        - Use travel rewards credit cards responsibly
        - Plan and budget for trips in advance
        - Consider off-season travel for cost savings
        - Balance experiences with long-term financial goals
        - Look for deals but don't compromise safety
        - Factor in all costs: flights, lodging, food, activities, insurance
        - Consider staycations and local experiences as alternatives
    `;
        }
        // --- NEW: Technology & Digital Finance ---
        if (lower.includes("fintech") || lower.includes("robo advisor") || lower.includes("digital banking") || lower.includes("online investing")) {
            return `
        Using technology for financial management:
        - Robo-advisors can be good for hands-off investing
        - Digital banks often offer higher interest rates
        - Use strong passwords and two-factor authentication
        - Be cautious of new fintech apps - verify legitimacy
        - Understand fees even with "free" services
        - Don't let automation replace financial awareness
        - Regular monitoring is still important
        - Keep some traditional banking relationships as backup
    `;
        }
        // --- NEW: Seasonal & Holiday Finances ---
        if (lower.includes("holidays") || lower.includes("christmas") || lower.includes("seasonal") || lower.includes("gift giving")) {
            return `
        Managing seasonal expenses:
        - Start saving for holidays early in the year
        - Set spending limits for gifts and stick to them
        - Consider homemade or experiential gifts
        - Use cash or debit for holiday shopping to avoid debt
        - Plan for seasonal income variations if applicable
        - Don't finance holidays with credit cards
        - Focus on meaningful experiences over expensive purchases
        - Review and adjust your budget after major seasons
    `;
        }
        // --- NEW: Financial Scams & Security ---
        if (lower.includes("scam") || lower.includes("fraud") || lower.includes("identity theft") || lower.includes("financial security")) {
            return `
        Protecting yourself from financial scams:
        - Never give personal information to unsolicited callers
        - Be wary of "guaranteed" investment returns
        - Monitor your accounts regularly for unauthorized activity
        - Use secure networks for financial transactions
        - Be skeptical of pressure to act quickly on financial decisions
        - Research any financial advisor or company thoroughly
        - Freeze your credit reports if not actively applying for credit
        - Report suspicious activity immediately to banks and authorities
    `;
        }
        // --- NEW: Gifting & Inheritance ---
        if (lower.includes("inheritance") || lower.includes("gift money") || lower.includes("estate") || lower.includes("will")) {
            return `
        Managing inherited money and gifts:
        - Don't rush into major decisions with inherited funds
        - Understand tax implications of gifts and inheritances
        - Consider paying off high-interest debt first
        - Diversify inherited investments if concentrated
        - Update your own estate planning documents
        - Consider the emotional aspects of inherited money
        - Seek professional advice for large inheritances
        - Use windfalls to accelerate existing financial goals
    `;
        }
        // --- NEW: Economic Uncertainty ---
        if (lower.includes("recession") || lower.includes("job loss") || lower.includes("economic uncertainty") || lower.includes("layoff")) {
            return `
        Preparing for economic uncertainty:
        - Build and maintain a robust emergency fund
        - Diversify your income sources when possible
        - Keep skills updated and marketable
        - Avoid taking on new debt during uncertain times
        - Consider recession-resistant career paths
        - Have a plan for expense reduction if needed
        - Stay informed but don't panic about economic news
        - Focus on what you can control: spending, saving, skills
    `;
        }
        // --- NEW: Charitable Giving ---
        if (lower.includes("charity") || lower.includes("donation") || lower.includes("giving") || lower.includes("tithing")) {
            return `
        Smart charitable giving strategies:
        - Budget for charitable giving like any other expense
        - Research charities to ensure your money is used effectively
        - Consider tax deductions for charitable contributions
        - Donate appreciated assets to avoid capital gains taxes
        - Set up automatic giving to make it consistent
        - Consider donor-advised funds for flexible giving
        - Balance generosity with your own financial security
        - Volunteer time if you can't afford to give money
    `;
        }
        // --- NEW: Wealth Building & Advanced Strategies ---
        if (lower.includes("wealth building") || lower.includes("rich") || lower.includes("millionaire") || lower.includes("financial independence")) {
            return `
        Advanced wealth-building strategies:
        - Increase your savings rate as income grows
        - Invest in appreciating assets (stocks, real estate, business)
        - Minimize taxes through strategic planning
        - Develop multiple income streams
        - Continuously educate yourself about investing
        - Consider tax-advantaged accounts maximization
        - Build valuable skills and networks
        - Be patient - wealth building is a long-term process
        - Consider working with fee-only financial advisors
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
        - Debt management
        - Emergency funds
        - Credit scores
        - Retirement planning
        - Insurance needs
        - Tax strategies
        Or just say "help" to get started!
    `;
    });
}
exports.default = getBotResponse;
