import { TransactionCategory, TransactionType } from 'model/transaction/interfaces/ITransaction';

const CATEGORY_REGEX_MAP: Record<TransactionCategory, RegExp[]> = {
    FOOD: [
        /\b(food|restaurant|cafe|meal|dine|eat|lunch|breakfast|dinner)\b/i
    ],
    TRANSPORT: [
        /\b(uber|lyft|taxi|metro|bus|train|fuel|gas|petrol|car|parking)\b/i
    ],
    ENTERTAINMENT: [
        /\b(movie|cinema|netflix|spotify|concert|game|streaming|theater)\b/i
    ],
    HEALTH: [
        /\b(hospital|clinic|pharma|medicine|doctor|health|prescription|dentist)\b/i
    ],
    EDUCATION: [
        /\b(school|college|university|course|tuition|book|library|exam)\b/i
    ],
    SHOPPING: [
        /\b(amazon|flipkart|myntra|ebay|shopping|retail|store|buy|purchase)\b/i
    ],
    TRAVEL: [
        /\b(flight|hotel|airbnb|trip|vacation|travel|journey|holiday)\b/i
    ],
    BILLS: [
        /\b(electricity|water|gas|internet|phone|utility|bill|postpaid)\b/i
    ],
    SUBSCRIPTIONS: [
        /\b(subscription|monthly|yearly|recurring|prime|plus|membership)\b/i
    ],
    GIFTS: [
        /\b(gift|present|donation|charity|donate)\b/i
    ],
    SAVINGS: [
        /\b(savings|deposit|locker|safe|stash)\b/i
    ],
    INVESTMENTS: [
        /\b(stock|bond|mutual fund|portfolio|invest|brokerage|sip|nps)\b/i
    ],
    MISCELLANEOUS: []
};

const TYPE_REGEX_MAP: Record<TransactionType, RegExp[]> = {
    REGULAR: [
        /\b(debit|credit|transaction|purchase|expense)\b/i
    ],
    TRANSFER: [
        /\b(transfer|sent|received|moved|transferred)\b/i
    ],
    PAYMENT: [
        /\b(payment|paid|settle|clear|remittance)\b/i
    ],
    ADJUSTMENT: [
        /\b(adjustment|correction|modify|update)\b/i
    ],
    FEE: [
        /\b(fee|charge|commission|processing|handling)\b/i
    ],
    REFUND: [
        /\b(refund|rebate|return|credited back)\b/i
    ],
    DEPOSIT: [
        /\b(deposit|added|loaded|top up)\b/i
    ],
    WITHDRAWAL: [
        /\b(withdrawal|withdraw|taken out|cash out)\b/i
    ],
    INTEREST: [
        /\b(interest|accrued|earned interest)\b/i
    ],
    DIVIDEND: [
        /\b(dividend|shareholder|payout)\b/i
    ],
    REWARD: [
        /\b(reward|points|bonus points|cashback)\b/i
    ],
    BONUS: [
        /\b(bonus|incentive|extra payment)\b/i
    ],
    CASHBACK: [
        /\b(cashback|rebate|discount back)\b/i
    ],
    REDEMPTION: [
        /\b(redeem|used points|voucher|coupon)\b/i
    ],
    CONVERSION: [
        /\b(convert|exchange|swap|token swap)\b/i
    ],
    EXCHANGE: [
        /\b(exchange rate|forex|currency exchange)\b/i
    ],
    LOAN: [
        /\b(loan|borrow|lend|financing)\b/i
    ],
    BORROWING: [
        /\b(borrow|debt|owe|loan taken)\b/i
    ],
    LENDING: [
        /\b(lend|give loan|loan provided)\b/i
    ],
    INVESTMENT: [
        /\b(invest|buy stock|buy bond|allocate)\b/i
    ],
    PURCHASE: [
        /\b(bought|acquired|purchased)\b/i
    ],
    SALE: [
        /\b(sold|disposed|liquidated)\b/i
    ],
    EXTRACTION: [
        /\b(mined|extracted|harvested)\b/i
    ]
};

const matchRegex = function (
    description: string,
    regexMap: Record<string, RegExp[]>,
    defaultValue: string
): string {
    if (!description) return defaultValue;
    
    const lowerDesc = description.toLowerCase();
    for (const [key, patterns] of Object.entries(regexMap)) {
        if (patterns.some(pattern => pattern.test(lowerDesc))) {
            return key;
        }
    }
    return defaultValue; 
}

export const classifyTransaction = function (description: string): {
    category: TransactionCategory;
    type: TransactionType;
} {
    if (!description) return {
        category: 'MISCELLANEOUS' as TransactionCategory,
        type: 'REGULAR' as TransactionType
    };

    const matchedCategory = matchRegex(description, CATEGORY_REGEX_MAP, 'MISCELLANEOUS');
    const matchedType = matchRegex(description, TYPE_REGEX_MAP, 'REGULAR');

    return {
        category: matchedCategory as TransactionCategory,
        type: matchedType as TransactionType
    };
}
