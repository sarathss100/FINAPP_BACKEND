import { SMART_CATEGORIES } from '../../model/transaction/interfaces/ITransaction';
export type TransactionSmartCategory = typeof SMART_CATEGORIES[number];

export const SMART_CATEGORY_REGEX_MAP: Record<TransactionSmartCategory, RegExp[]> = {
    // Income Categories
    SALARY: [
        /\b(salary|monthly pay|net pay|credited by employer|payroll|company salary)\b/i,
        /\b(abc corp|xyz pvt ltd|payment from company|employer payment)\b/i
    ],
    FREELANCE: [
        /\b(freelance|fiverr|upwork|remote job|contractor payment|gig work|independent contractor|side job|freelancing income)\b/i,
        /\b(client payment|project fee|hourly rate|task payment|freelancer income)\b/i
    ],
    BUSINESS_INCOME: [
        /\b(business income|sales revenue|invoice payment|business credit|service rendered|self employed income)\b/i,
        /\b(invoice received|client payment|business deposit|gst invoice|tax invoice)\b/i
    ],
    INVESTMENT_RETURN: [
        /\b(capital gain|mutual fund return|stock sale|investment profit|portfolio gain|sip withdrawal|equity profit)\b/i,
        /\b(stock dividend|fd interest|savings interest|investment return|equity profit)\b/i,
        /\b(mutual fund|mf|sip|nps|elss|ulip|mutual fund purchase|mutual fund sale)\b/i
    ],
    DIVIDEND: [
        /\b(dividend|dividend received|stock dividend|bonus shares|equity dividend|mf dividend|shareholder payout)\b/i
    ],
    INTEREST: [
        /\b(interest|interest income|fd interest|rd interest|savings interest|bank interest|accrued interest)\b/i
    ],
    RENTAL_INCOME: [
        /\b(rental income|rent received|pg owner|flat rent received|property rent|house rent received|tenant payment)\b/i
    ],
    GIFT_RECEIVED: [
        /\b(gift received|gift amount|money gift|birthday gift|received gift|cash received as gift|present received)\b/i
    ],
    BONUS: [
        /\b(bonus|year end bonus|diwali bonus|performance bonus|joining bonus|referral bonus|extra incentive)\b/i
    ],
    GOVERNMENT_BENEFIT: [
        /\b(pm kisan|nrega|rural employment|govt subsidy|beneficiary payment|welfare scheme|free ration|subsidized gas|pension received)\b/i
    ],
    REFUND: [
        /\b(refund|rebate|return|credited back|order cancelled|payment returned|refund processed|refund initiated|money back)\b/i
    ],
    OTHER_INCOME: [],

    // Expense Categories
    FOOD: [
        /\b(food|restaurant|cafe|meal|dine|eat|lunch|breakfast|dinner|swiggy|zomato|kirana|grocery|bigbasket|reliance fresh|more supermarket|dmart grocery|blinkit|instamart)\b/i
    ],
    RENT: [
        /\b(rent|lease|tenant|landlord|housing|apartment|flat|pg|room rent|monthly rent|flat rent|house rent)\b/i
    ],
    UTILITY_BILL: [
        /\b(electricity bill|water bill|gas connection|utility bill|electricity payment|bescom|tneb|discom|power bill)\b/i,
        /\b(postpaid connection|landline bill|telephone bill|mobile postpaid)\b/i,
        /\b(utility payment|bill paid|payment for utility|bill cleared|postpaid service)\b/i
    ],
    MOBILE_RECHARGE: [
        /\b(recharge|top up|prepaid mobile|airtel recharge|jio topup|vi recharge|mobile topup|phonepe recharge|paytm recharge)\b/i,
        /\b(data pack|call pack|sms pack|sim recharge|mobile balance)\b/i
    ],
    INTERNET_BILL: [
        /\b(internet bill|broadband bill|wifi bill|adsl|fiber connection|jio fiber|bsnl broadband|vodafone broadband|airtel xstream)\b/i,
        /\b(dsl service|internet subscription|data plan|isp bill|wifi provider)\b/i
    ],
    TRANSPORT: [
        /\b(uber|ola|taxi|metro|bus|train|fuel|gas|petrol|car|parking|local transport|irctc|railway ticket|ola auto|auto rickshaw)\b/i
    ],
    SHOPPING: [
        /\b(shopping|amazon|flipkart|myntra|ebay|retail|store|buy|purchase|ajio|nykaa|meesho|firstcry|tata cliq|shoppers stop)\b/i
    ],
    HEALTH_MEDICAL: [
        /\b(hospital|clinic|pharma|medicine|doctor visit|prescription|dentist|chemist|medical store|health checkup|diagnostic test|apollo|fortis|max healthcare)\b/i
    ],
    EDUCATION: [
        /\b(school fees|college fees|exam fee|course fee|books purchase|online course|coaching class|vedantu|byju's|unacademy|gradeup)\b/i
    ],
    INSURANCE: [
        /\b(insurance|policy payment|premium|life insurance|health insurance|car insurance|bike insurance|term plan|mediclaim|claim settlement)\b/i
    ],
    LOAN_PAYMENT: [
        /\b(loan payment|personal loan|car loan|home loan|gold loan|borrowing repayment|loan clearance|emi|loan installment)\b/i
    ],
    EMI: [
        /\b(emi|installment|loan emi|purchase emi|credit card emi|no cost emi|monthly installment|equated monthly installment)\b/i
    ],
    TAX: [
        /\b(tax|income tax|gst|it return|tds deduction|property tax|wealth tax|direct tax|indirect tax|tax payment)\b/i
    ],
    SUBSCRIPTION: [
        /\b(subscription|monthly subscription|yearly plan|recurring payment|prime membership|netflix|hotstar|spotify|magazine subscription|apple plus|ott|primevideo)\b/i
    ],
    GROCERIES: [
        /\b(grocery|bigbasket|dmart grocery|reliance fresh|more supermarket|kirana shop|local market|vegetables|fruits|weekly groceries|milk delivery|food items)\b/i
    ],
    DINING_OUT: [
        /\b(restaurant|cafe|zomato|swiggy|delivery order|takeaway|fine dining|fast food|eating out|food court|hotel|street food)\b/i
    ],
    ENTERTAINMENT: [
        /\b(movie|cinema|netflix|spotify|concert|theater|game|streaming|disney+ hotstar|playstation|music streaming|ott platform|mx player|voot|jio cinema)\b/i
    ],
    TRAVEL: [
        /\b(travel|flight ticket|railway ticket|hotel booking|oyo|makemytrip|goibibo|irctc|redbus|vacation trip|international travel|domestic travel|travel expense)\b/i
    ],
    PERSONAL_CARE: [
        /\b(beauty|salon|spa|haircut|facial|makeup|skincare|cosmetics|perfume|deodorant|toiletries|grooming|barber|shaving|face wash|body lotion)\b/i
    ],
    HOME_IMPROVEMENT: [
        /\b(home improvement|painting|plumbing|interior design|furniture|wardrobe|kitchen cabinet|flooring|renovation|woodwork|carpenter|electrician|handyman|decorative items)\b/i
    ],
    VEHICLE_EXPENSE: [
        /\b(car|bike|fuel|petrol|diesel|vehicle maintenance|tyre change|battery replacement|oil change|car service|two wheeler|four wheeler|auto repair)\b/i,
        /\b(vehicle insurance|road tax|registration|parking fee|toll tax|car cleaning|wash station)\b/i
    ],
    GIFTS_DONATIONS: [
        /\b(gift|donation|charity|ngo donation|temple offering|wedding gift|birthday present|religious offering|seva|contributions)\b/i
    ],
    FEES_CHARGES: [
        /\b(fee|charge|bank charge|processing fee|service tax|convenience fee|late fee|penalty|cheque bounce|insufficient balance|gst|handling charge)\b/i
    ],

    // UPI / Transfers
    TRANSFER: [
        /\b(paid via|sent to|transferred to|UPI transfer|UPI payment|transfer done|money sent|UPI transaction|UPI payment received|transfer made|fund sent|transferred money)\b/i
    ],

    MISCELLANEOUS: []
};

export const classify = function (description: string, transactionType: 'INCOME' | 'EXPENSE') {
    if (!description) return 'MISCELLANEOUS';

    const lowerDesc = description.toLowerCase();

    for (const smart_category of SMART_CATEGORIES) {
        const patterns = SMART_CATEGORY_REGEX_MAP[smart_category] || [];
        if (patterns.some((pattern) => pattern.test(lowerDesc))) {
            return smart_category;
        }
    }

    if (transactionType === 'INCOME') {
        return 'OTHER_INCOME';
    } else {
        return 'MISCELLANEOUS';
    }
}
