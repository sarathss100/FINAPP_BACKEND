"use strict";
// import { TransactionCategory } from 'model/transaction/interfaces/ITransaction';
// import { SMART_CATEGORIES } from 'model/transaction/interfaces/ITransaction';
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyTransaction = void 0;
// Enhanced regex patterns combining both systems with improved intelligence
const ENHANCED_CATEGORY_PATTERNS = {
    // Income Categories
    SALARY: [
        /\b(salary|monthly pay|net pay|credited by employer|payroll|company salary|employee salary|job salary)\b/i,
        /\b(abc corp|xyz pvt ltd|payment from company|employer payment|corporate salary)\b/i,
        /\b(salary transfer|monthly salary|basic salary|gross salary|take home)\b/i,
        /UPI.*SALARY/i,
        /NEFT.*SALARY/i,
        /SALARY.*CREDITED/i,
        /EMPLOYER.*PAYMENT/i
    ],
    FREELANCE: [
        /\b(freelance|fiverr|upwork|remote job|contractor payment|gig work|independent contractor|side job|freelancing income)\b/i,
        /\b(client payment|project fee|hourly rate|task payment|freelancer income|consultation fee)\b/i,
        /\b(consultancy|contract work|part time work|remote work|work from home income)\b/i,
        /UPI.*FREELANCE/i,
        /CLIENT.*PAYMENT/i,
        /PROJECT.*FEE/i
    ],
    BUSINESS_INCOME: [
        /\b(business income|sales revenue|invoice payment|business credit|service rendered|self employed income)\b/i,
        /\b(invoice received|client payment|business deposit|gst invoice|tax invoice|trade income)\b/i,
        /\b(service income|professional income|business earning|merchant payment|vendor payment)\b/i,
        /BUSINESS.*INCOME/i,
        /INVOICE.*PAYMENT/i,
        /SALES.*REVENUE/i
    ],
    INVESTMENT_RETURN: [
        /\b(capital gain|mutual fund return|stock sale|investment profit|portfolio gain|sip withdrawal|equity profit)\b/i,
        /\b(stock dividend|fd interest|savings interest|investment return|equity profit|trading profit)\b/i,
        /\b(mutual fund|mf|sip|nps|elss|ulip|mutual fund purchase|mutual fund sale|fund redemption)\b/i,
        /\b(share sale|equity sale|bond maturity|debt fund|hybrid fund|index fund)\b/i,
        /UPI.*ZERODHA/i,
        /UPI.*UPSTOX/i,
        /UPI.*GROWW/i,
        /INVESTMENT.*RETURN/i,
        /MUTUAL.*FUND.*CREDIT/i
    ],
    DIVIDEND: [
        /\b(dividend|dividend received|stock dividend|bonus shares|equity dividend|mf dividend|shareholder payout)\b/i,
        /\b(interim dividend|final dividend|special dividend|quarterly dividend|annual dividend)\b/i,
        /DIVIDEND.*RECEIVED/i,
        /STOCK.*DIVIDEND/i,
        /COMPANY.*DIVIDEND/i
    ],
    INTEREST: [
        /\b(interest|interest income|fd interest|rd interest|savings interest|bank interest|accrued interest)\b/i,
        /\b(term deposit interest|recurring deposit interest|ppf interest|nsc interest)\b/i,
        /INTEREST.*CREDITED/i,
        /FD.*INTEREST/i,
        /RD.*INTEREST/i,
        /SAVINGS.*INTEREST/i
    ],
    RENTAL_INCOME: [
        /\b(rental income|rent received|pg owner|flat rent received|property rent|house rent received|tenant payment)\b/i,
        /\b(property income|rental payment|lease income|accommodation income)\b/i,
        /RENT.*RECEIVED/i,
        /RENTAL.*INCOME/i,
        /TENANT.*PAYMENT/i
    ],
    GIFT_RECEIVED: [
        /\b(gift received|gift amount|money gift|birthday gift|received gift|cash received as gift|present received)\b/i,
        /\b(festival gift|wedding gift|anniversary gift|celebration gift|family gift)\b/i,
        /GIFT.*RECEIVED/i,
        /MONEY.*GIFT/i
    ],
    BONUS: [
        /\b(bonus|year end bonus|diwali bonus|performance bonus|joining bonus|referral bonus|extra incentive)\b/i,
        /\b(festival bonus|eid bonus|christmas bonus|incentive|employee bonus|achievement bonus)\b/i,
        /BONUS.*CREDITED/i,
        /INCENTIVE.*PAYMENT/i,
        /PERFORMANCE.*BONUS/i
    ],
    GOVERNMENT_BENEFIT: [
        /\b(pm kisan|nrega|rural employment|govt subsidy|beneficiary payment|welfare scheme|free ration|subsidized gas|pension received)\b/i,
        /\b(government benefit|subsidy|scholarship|grant|welfare payment|social security)\b/i,
        /GOVT.*BENEFIT/i,
        /SUBSIDY.*PAYMENT/i,
        /PENSION.*CREDITED/i
    ],
    REFUND: [
        /\b(refund|rebate|return|credited back|order cancelled|payment returned|refund processed|refund initiated|money back)\b/i,
        /\b(transaction reversed|amount reversed|merchant refund|booking cancelled|cashback)\b/i,
        /REFUND.*PROCESSED/i,
        /AMOUNT.*REVERSED/i,
        /ORDER.*CANCELLED/i,
        /UPI.*REFUND/i
    ],
    OTHER_INCOME: [],
    // Expense Categories - Enhanced with detailed patterns
    FOOD: [
        // Restaurants and Dining
        /\b(restaurant|cafe|meal|dine|eat|lunch|breakfast|dinner|food court|fine dining|fast food|street food)\b/i,
        /\b(zomato|swiggy|delivery order|takeaway|home delivery|food delivery|online food)\b/i,
        /\b(dominos|pizza hut|kfc|mcdonalds|burger king|subway|starbucks|cafe coffee day|barista)\b/i,
        // Groceries
        /\b(grocery|kirana|bigbasket|reliance fresh|more supermarket|dmart grocery|blinkit|instamart)\b/i,
        /\b(vegetables|fruits|meat|chicken|fish|dairy|milk|bread|rice|wheat|cooking oil|spices)\b/i,
        /\b(zepto|dunzo|grofers|amazon fresh|flipkart grocery|jiomart|nature's basket)\b/i,
        // Food Items
        /\b(snacks|beverages|drinks|juice|coffee|tea|ice cream|dessert|bakery|confectionery)\b/i,
        // Bank patterns
        /UPI.*(SWIGGY|ZOMATO|BIGBASKET|GROFERS|DUNZO|BLINKIT)/i,
        /CARD.*(SWIGGY|ZOMATO|RESTAURANT|CAFE|FOOD)/i,
        /POS.*(RESTAURANT|CAFE|FOOD|GROCERY)/i,
        /(DMART|MORE RETAIL|RELIANCE RETAIL|SPENCER|WALMART)/i
    ],
    RENT: [
        /\b(rent|lease|tenant|landlord|housing|apartment|flat|pg|room rent|monthly rent|house rent)\b/i,
        /\b(property rent|villa rent|studio rent|1bhk|2bhk|3bhk|duplex rent|penthouse)\b/i,
        /\b(hostel|dormitory|guest house|service apartment|paying guest|shared accommodation)\b/i,
        /\b(co-living|coliving|zolo|stanza living|your space|nest away|hello world)\b/i,
        /UPI.*RENT/i,
        /NEFT.*RENT/i,
        /TRANSFER.*RENT/i,
        /HOUSE.*OWNER/i,
        /FLAT.*OWNER/i
    ],
    UTILITY_BILL: [
        /\b(electricity bill|water bill|gas connection|utility bill|electricity payment|bescom|tneb|discom|power bill)\b/i,
        /\b(lpg|cylinder|cooking gas|piped gas|municipal tax|property tax|sewerage)\b/i,
        /\b(maintenance|society|apartment|housing society|flat maintenance)\b/i,
        /UPI.*(ELECTRICITY|WATER|GAS)/i,
        /BILL.*PAYMENT/i,
        /(TNEB|BESCOM|MSEB|PSEB|KSEB|BSES|RELIANCE ENERGY|TATA POWER)/i
    ],
    MOBILE_RECHARGE: [
        /\b(recharge|top up|prepaid mobile|airtel recharge|jio topup|vi recharge|mobile topup|phonepe recharge|paytm recharge)\b/i,
        /\b(data pack|call pack|sms pack|sim recharge|mobile balance|prepaid plan)\b/i,
        /UPI.*(RECHARGE|JIO|AIRTEL|VI|VODAFONE)/i,
        /MOBILE.*RECHARGE/i,
        /PREPAID.*RECHARGE/i
    ],
    INTERNET_BILL: [
        /\b(internet bill|broadband bill|wifi bill|adsl|fiber connection|jio fiber|bsnl broadband|vodafone broadband|airtel xstream)\b/i,
        /\b(dsl service|internet subscription|data plan|isp bill|wifi provider|landline|telephone)\b/i,
        /UPI.*(INTERNET|BROADBAND)/i,
        /INTERNET.*BILL/i,
        /BROADBAND.*BILL/i
    ],
    TRANSPORT: [
        // Ride sharing and public transport
        /\b(uber|ola|taxi|metro|bus|train|local transport|irctc|railway ticket|auto rickshaw)\b/i,
        /\b(rapido|meru|bike taxi|e-rickshaw|shared auto|cab service|ride sharing)\b/i,
        // Fuel and vehicle
        /\b(fuel|gas|petrol|diesel|cng|vehicle service|maintenance|car wash|tyre)\b/i,
        /\b(toll|highway|parking|valet parking|airport parking|vehicle insurance)\b/i,
        // Airlines and trains
        /\b(flight|airline|indigo|spicejet|air india|vistara|go air|akasa air)\b/i,
        /\b(railway|train ticket|tatkal|ac coach|sleeper|metro card)\b/i,
        // Bank patterns
        /UPI.*(OLA|UBER|RAPIDO|IRCTC)/i,
        /CARD.*(FUEL|PETROL|DIESEL|IRCTC)/i,
        /(INDIAN OIL|BHARAT PETROLEUM|HINDUSTAN PETROLEUM|SHELL)/i,
        /(DMRC|KSRTC|MSRTC|BMTC|BEST|PARKING|TOLL)/i
    ],
    SHOPPING: [
        // E-commerce
        /\b(amazon|flipkart|myntra|ebay|shopping|retail|store|buy|purchase)\b/i,
        /\b(ajio|limeroad|nykaa|meesho|firstcry|tata cliq|shoppers stop)\b/i,
        // Categories
        /\b(clothing|fashion|apparel|shoes|accessories|jewelry|watch|bag|wallet)\b/i,
        /\b(electronics|mobile|laptop|tablet|headphones|speaker|camera|tv)\b/i,
        /\b(home appliances|furniture|kitchen|utensils|decoration|bedding)\b/i,
        /\b(cosmetics|beauty|skincare|makeup|perfume|toys|games|baby products)\b/i,
        // Bank patterns
        /UPI.*(AMAZON|FLIPKART|MYNTRA|NYKAA|AJIO|MEESHO)/i,
        /CARD.*(AMAZON|FLIPKART|MYNTRA|SHOPPING|RETAIL)/i,
        /(SHOPPERS STOP|LIFESTYLE|WESTSIDE|PANTALOONS|BIG BAZAAR)/i
    ],
    HEALTH_MEDICAL: [
        /\b(hospital|clinic|pharma|medicine|doctor|health|prescription|dentist)\b/i,
        /\b(apollo|fortis|max healthcare|chemist|medical|surgery|treatment|therapy)\b/i,
        /\b(lab test|blood test|x-ray|mri|ct scan|ultrasound|pathology|checkup)\b/i,
        /\b(pharmacy|medical store|drug|tablet|vaccine|health insurance|mediclaim)\b/i,
        /UPI.*(APOLLO|FORTIS|MAX|PHARMA|MEDICAL|HOSPITAL)/i,
        /CARD.*(HOSPITAL|MEDICAL|PHARMA)/i,
        /(APOLLO.*PHARMACY|MEDPLUS|NETMEDS|1MG|PHARMEASY)/i
    ],
    EDUCATION: [
        /\b(school|college|university|course|tuition|book|library|exam|coaching)\b/i,
        /\b(vedantu|byju's|unacademy|gradeup|fees|admission|certificate|degree)\b/i,
        /\b(online course|e-learning|udemy|coursera|khan academy|skill development)\b/i,
        /UPI.*(BYJU|VEDANTU|UNACADEMY|SCHOOL|COLLEGE|FEES)/i,
        /CARD.*(SCHOOL|COLLEGE|FEES)/i,
        /(EDUCATION.*FEE|TUITION.*FEE|ADMISSION.*FEE|EXAM.*FEE)/i
    ],
    INSURANCE: [
        /\b(insurance|policy payment|premium|life insurance|health insurance|car insurance|bike insurance|term plan|mediclaim)\b/i,
        /\b(insurance premium|annual premium|quarterly premium|monthly premium)\b/i,
        /INSURANCE.*PREMIUM/i,
        /POLICY.*PAYMENT/i,
        /PREMIUM.*PAYMENT/i
    ],
    LOAN_PAYMENT: [
        /\b(loan payment|personal loan|car loan|home loan|gold loan|borrowing repayment|loan clearance)\b/i,
        /\b(loan installment|loan emi|principal payment|interest payment)\b/i,
        /LOAN.*PAYMENT/i,
        /LOAN.*EMI/i,
        /LOAN.*INSTALLMENT/i
    ],
    EMI: [
        /\b(emi|installment|loan emi|purchase emi|credit card emi|no cost emi|monthly installment|equated monthly installment)\b/i,
        /\b(home loan emi|car loan emi|personal loan emi)\b/i,
        /EMI.*PAYMENT/i,
        /MONTHLY.*EMI/i,
        /INSTALLMENT.*PAYMENT/i
    ],
    TAX: [
        /\b(tax|income tax|gst|it return|tds deduction|property tax|wealth tax|direct tax|indirect tax|tax payment)\b/i,
        /\b(advance tax|self assessment tax|tax filing|tax consultant)\b/i,
        /TAX.*PAYMENT/i,
        /INCOME.*TAX/i,
        /GST.*PAYMENT/i
    ],
    SUBSCRIPTION: [
        /\b(subscription|monthly subscription|yearly plan|recurring payment|prime membership)\b/i,
        /\b(netflix|hotstar|spotify|magazine subscription|apple plus|ott|primevideo)\b/i,
        /\b(annual subscription|premium account|software subscription|cloud storage)\b/i,
        /UPI.*SUBSCRIPTION/i,
        /SUBSCRIPTION.*PAYMENT/i,
        /(NETFLIX|SPOTIFY|AMAZON.*PRIME|DISNEY.*HOTSTAR|YOUTUBE.*PREMIUM)/i
    ],
    GROCERIES: [
        /\b(grocery|bigbasket|dmart grocery|reliance fresh|more supermarket|kirana shop|local market)\b/i,
        /\b(vegetables|fruits|weekly groceries|milk delivery|food items|cooking ingredients)\b/i,
        /\b(dal|rice|wheat|spices|masala|kitchen supplies|household items)\b/i,
        /UPI.*(BIGBASKET|GROFERS|DMART|RELIANCE|MORE)/i,
        /GROCERY.*PURCHASE/i,
        /WEEKLY.*GROCERY/i
    ],
    DINING_OUT: [
        /\b(restaurant|cafe|zomato|swiggy|delivery order|takeaway|fine dining|fast food|eating out|food court)\b/i,
        /\b(hotel dining|street food|local food|buffet|catering)\b/i,
        /UPI.*(ZOMATO|SWIGGY)/i,
        /RESTAURANT.*BILL/i,
        /DINING.*EXPENSE/i
    ],
    ENTERTAINMENT: [
        /\b(movie|cinema|netflix|spotify|concert|theater|game|streaming)\b/i,
        /\b(disney+ hotstar|sony liv|alt balaji|mx player|voot|jio cinema)\b/i,
        /\b(gaming|xbox|playstation|amusement park|bowling|live show)\b/i,
        /\b(pvr|inox|cinepolis|carnival|movie ticket|sports event)\b/i,
        /UPI.*(NETFLIX|SPOTIFY|HOTSTAR|PRIME)/i,
        /(PVR|INOX|CINEPOLIS|CARNIVAL|MOVIE|CINEMA)/i
    ],
    TRAVEL: [
        /\b(flight|hotel|airbnb|trip|vacation|travel|journey|holiday)\b/i,
        /\b(goibibo|makemytrip|oyo|cleartrip|redbus|ixigo|booking|reservation)\b/i,
        /\b(tour package|visa|passport|travel insurance|forex)\b/i,
        /UPI.*(MAKEMYTRIP|GOIBIBO|OYO|CLEARTRIP|IXIGO|REDBUS)/i,
        /(INDIGO|SPICEJET|AIR INDIA|VISTARA)/i,
        /TRAVEL.*BOOKING/i
    ],
    PERSONAL_CARE: [
        /\b(beauty|salon|spa|haircut|facial|makeup|skincare|cosmetics|perfume)\b/i,
        /\b(toiletries|grooming|barber|shaving|deodorant|body lotion)\b/i,
        /SALON.*PAYMENT/i,
        /BEAUTY.*PURCHASE/i,
        /PERSONAL.*CARE/i
    ],
    HOME_IMPROVEMENT: [
        /\b(home improvement|painting|plumbing|interior design|furniture|wardrobe)\b/i,
        /\b(kitchen cabinet|flooring|renovation|woodwork|carpenter|electrician|handyman)\b/i,
        /HOME.*IMPROVEMENT/i,
        /FURNITURE.*PURCHASE/i,
        /RENOVATION.*COST/i
    ],
    VEHICLE_EXPENSE: [
        /\b(car|bike|fuel|petrol|diesel|vehicle maintenance|tyre change|battery replacement)\b/i,
        /\b(oil change|car service|two wheeler|four wheeler|auto repair|vehicle insurance)\b/i,
        /\b(road tax|registration|parking fee|toll tax|car cleaning)\b/i,
        /VEHICLE.*MAINTENANCE/i,
        /CAR.*SERVICE/i,
        /BIKE.*SERVICE/i
    ],
    GIFTS_DONATIONS: [
        /\b(gift|donation|charity|ngo donation|temple offering|wedding gift|birthday present)\b/i,
        /\b(religious offering|seva|contributions|festival gift|celebration gift)\b/i,
        /GIFT.*PAYMENT/i,
        /DONATION.*TO/i,
        /CHARITY.*PAYMENT/i
    ],
    FEES_CHARGES: [
        /\b(fee|charge|bank charge|processing fee|service tax|convenience fee|late fee|penalty)\b/i,
        /\b(cheque bounce|insufficient balance|gst|handling charge|transaction fee)\b/i,
        /BANK.*CHARGES/i,
        /SERVICE.*CHARGE/i,
        /PROCESSING.*FEE/i
    ],
    TRANSFER: [
        /\b(paid via|sent to|transferred to|UPI transfer|UPI payment|transfer done|money sent)\b/i,
        /\b(UPI transaction|UPI payment received|transfer made|fund sent|transferred money)\b/i,
        /\b(fund transfer|p2p transfer|person to person|family transfer|friend transfer)\b/i,
        /UPI.*TO/i,
        /TRANSFER.*TO/i,
        /SENT.*TO/i
    ],
    MISCELLANEOUS: []
};
// Transaction type patterns
const TYPE_PATTERNS = {
    REGULAR: [
        /\b(debit|credit|transaction|purchase|expense|payment made|money spent|card payment)\b/i,
        /\b(pos transaction|merchant payment|contactless payment|online purchase)\b/i,
        /\b(bill payment|utility payment|subscription fee|membership fee)\b/i
    ],
    TRANSFER: [
        /\b(transfer|sent|received|moved|transferred|bank transfer|wire transfer|imps|neft|rtgs|upi transfer)\b/i,
        /\b(google pay|phonepe|paytm|bhim upi|to contact|from contact|fund transfer)\b/i,
        /\b(p2p transfer|peer to peer|person to person|family transfer)\b/i
    ],
    PAYMENT: [
        /\b(payment|paid|settle|clear|remittance|cleared dues|made payment|processed payment)\b/i,
        /\b(bill settled|invoice paid|dues cleared|outstanding cleared)\b/i,
        /\b(loan payment|emi payment|credit card payment|insurance premium)\b/i
    ],
    ADJUSTMENT: [
        /\b(adjustment|correction|modify|update|reversed|refund adjusted|chargeback|error correction)\b/i,
        /\b(balance adjustment|account adjustment|reconciliation|dispute resolution)\b/i
    ],
    FEE: [
        /\b(fee|charge|commission|processing|handling|service charge|bank charges|convenience fee)\b/i,
        /\b(atm fee|transaction fee|annual maintenance|gst|service tax)\b/i
    ],
    REFUND: [
        /\b(refund|rebate|return|credited back|returned amount|order cancelled|reversal)\b/i,
        /\b(transaction reversed|amount reversed|merchant refund|booking cancelled)\b/i
    ],
    DEPOSIT: [
        /\b(deposit|added|loaded|top up|fund added|salary credited|bonus credited)\b/i,
        /\b(cheque cleared|income credited|rental income|business income)\b/i
    ],
    WITHDRAWAL: [
        /\b(withdrawal|withdraw|taken out|cash out|cash withdrawal|atm withdrawal)\b/i,
        /\b(branch withdrawal|counter withdrawal|pos cash|cashback at pos)\b/i
    ],
    INTEREST: [
        /\b(interest|accrued|earned interest|interest credited|fd interest|savings interest)\b/i,
        /\b(compound interest|simple interest|bank interest|deposit interest)\b/i
    ],
    DIVIDEND: [
        /\b(dividend|shareholder|payout|stock dividend|bonus shares|dividend received)\b/i,
        /\b(mutual fund dividend|quarterly dividend|annual dividend)\b/i
    ],
    REWARD: [
        /\b(reward|points|bonus points|cashback|loyalty reward|reward points|milestone bonus)\b/i,
        /\b(credit card rewards|debit card rewards|shopping rewards)\b/i
    ],
    BONUS: [
        /\b(bonus|incentive|extra payment|festival bonus|performance bonus|joining bonus)\b/i,
        /\b(diwali bonus|year end bonus|employee bonus|achievement bonus)\b/i
    ],
    CASHBACK: [
        /\b(cashback|rebate|discount back|instant cashback|offer cashback|upi cashback)\b/i,
        /\b(merchant cashback|category cashback|promotional cashback)\b/i
    ],
    REDEMPTION: [
        /\b(redeem|used points|voucher|coupon|redeemed|claim voucher|gift card redeemed)\b/i,
        /\b(reward redemption|points redemption|loyalty redemption)\b/i
    ],
    CONVERSION: [
        /\b(convert|exchange|swap|currency conversion|forex conversion|crypto conversion)\b/i,
        /\b(mutual fund switch|portfolio rebalancing|asset conversion)\b/i
    ],
    EXCHANGE: [
        /\b(exchange rate|forex|currency exchange|foreign exchange|usd to inr)\b/i,
        /\b(cross currency|remittance|international transfer)\b/i
    ],
    LOAN: [
        /\b(loan|borrow|lend|financing|emi|personal loan|home loan|car loan)\b/i,
        /\b(loan disbursed|loan sanctioned|mortgage loan|education loan)\b/i
    ],
    BORROWING: [
        /\b(borrow|debt|owe|loan taken|took loan|borrow money|loan availed)\b/i,
        /\b(credit availed|advance taken|emergency loan|quick loan)\b/i
    ],
    LENDING: [
        /\b(lend|give loan|loan provided|lent|lending|money lent|peer lending)\b/i,
        /\b(family lending|personal lending|advance given)\b/i
    ],
    INVESTMENT: [
        /\b(invest|buy stock|buy bond|sip started|invested in mf|stock purchase)\b/i,
        /\b(mutual fund|equity investment|portfolio addition|systematic investment)\b/i
    ],
    PURCHASE: [
        /\b(bought|acquired|purchased|made purchase|buy online|shop purchase)\b/i,
        /\b(retail purchase|grocery shopping|electronics purchase)\b/i
    ],
    SALE: [
        /\b(sold|disposed|liquidated|sale completed|item sold|product sold)\b/i,
        /\b(business sale|marketplace sale|vehicle sale|asset sale)\b/i
    ],
    EXTRACTION: [
        /\b(mined|extracted|harvested|yielded|mining income|crypto mined)\b/i,
        /\b(agricultural yield|staking reward|yield farming)\b/i
    ]
};
// Category mapping for better intelligence
const CATEGORY_SMART_MAPPING = {
    'RENT': 'RENT',
    'FOOD': 'FOOD',
    'TRANSPORT': 'TRANSPORT',
    'ENTERTAINMENT': 'ENTERTAINMENT',
    'HEALTH': 'HEALTH_MEDICAL',
    'EDUCATION': 'EDUCATION',
    'SHOPPING': 'SHOPPING',
    'TRAVEL': 'TRAVEL',
    'BILLS': 'UTILITY_BILL',
    'SUBSCRIPTIONS': 'SUBSCRIPTION',
    'GIFTS': 'GIFTS_DONATIONS',
    'SAVINGS': 'MISCELLANEOUS',
    'INVESTMENTS': 'INVESTMENT_RETURN',
    'MISCELLANEOUS': 'MISCELLANEOUS'
};
// Income indicators for better classification
const INCOME_INDICATORS = [
    /\b(credited|received|income|earned|profit|gain|bonus|salary|dividend|interest|refund|cashback|reward)\b/i,
    /\b(deposit|added|loaded|top up|fund added|money received|amount credited)\b/i,
    /CR\b/i,
    /CREDIT/i,
    /\+/,
    /INWARD/i
];
// Expense indicators
const EXPENSE_INDICATORS = [
    /\b(debited|paid|spent|purchase|bought|withdraw|transferred to|sent to|bill|fee|charge)\b/i,
    /\b(debit|payment|expense|cost|price|amount paid|money spent)\b/i,
    /DR\b/i,
    /DEBIT/i,
    /-/,
    /OUTWARD/i
];
// Helper function to match patterns
const matchPatterns = (description, patterns) => {
    if (!description || patterns.length === 0)
        return false;
    const lowerDesc = description.toLowerCase();
    return patterns.some(pattern => pattern.test(lowerDesc));
};
// Determine transaction nature (income/expense)
const determineTransactionNature = (description, amount) => {
    if (amount !== undefined) {
        return amount > 0 ? 'INCOME' : 'EXPENSE';
    }
    const hasIncomeIndicator = matchPatterns(description, INCOME_INDICATORS);
    const hasExpenseIndicator = matchPatterns(description, EXPENSE_INDICATORS);
    if (hasIncomeIndicator && !hasExpenseIndicator)
        return 'INCOME';
    if (hasExpenseIndicator && !hasIncomeIndicator)
        return 'EXPENSE';
    // Default to expense if unclear
    return 'EXPENSE';
};
// Enhanced classification function
const classifyTransaction = function (description, amount) {
    if (!description) {
        return {
            smartCategory: 'MISCELLANEOUS',
            category: 'MISCELLANEOUS',
            type: 'REGULAR',
            confidence: 0,
            transactionNature: amount && amount > 0 ? 'INCOME' : 'EXPENSE'
        };
    }
    const transactionNature = determineTransactionNature(description, amount);
    const lowerDesc = description.toLowerCase();
    let bestSmartCategory = 'MISCELLANEOUS';
    let bestType = 'REGULAR';
    let maxConfidence = 0;
    let matchedPatterns = 0;
    // Classify smart category
    for (const [category, patterns] of Object.entries(ENHANCED_CATEGORY_PATTERNS)) {
        if (patterns.length === 0)
            continue;
        const matches = patterns.filter(pattern => pattern.test(lowerDesc));
        if (matches.length > 0) {
            const confidence = (matches.length / patterns.length) * 100;
            if (confidence > maxConfidence) {
                maxConfidence = confidence;
                bestSmartCategory = category;
                matchedPatterns = matches.length;
            }
        }
    }
    // Classify transaction type
    let typeConfidence = 0;
    for (const [type, patterns] of Object.entries(TYPE_PATTERNS)) {
        const matches = patterns.filter(pattern => pattern.test(lowerDesc));
        if (matches.length > 0) {
            const confidence = (matches.length / patterns.length) * 100;
            if (confidence > typeConfidence) {
                typeConfidence = confidence;
                bestType = type;
            }
        }
    }
    // Map smart category to regular category
    let mappedCategory = 'MISCELLANEOUS';
    for (const [regularCat, smartCat] of Object.entries(CATEGORY_SMART_MAPPING)) {
        if (smartCat === bestSmartCategory) {
            mappedCategory = regularCat;
            break;
        }
    }
    // Adjust confidence based on transaction nature and category alignment
    if (transactionNature === 'INCOME') {
        const incomeCategories = ['SALARY', 'FREELANCE', 'BUSINESS_INCOME', 'INVESTMENT_RETURN',
            'DIVIDEND', 'INTEREST', 'RENTAL_INCOME', 'GIFT_RECEIVED',
            'BONUS', 'GOVERNMENT_BENEFIT', 'REFUND', 'OTHER_INCOME'];
        if (incomeCategories.includes(bestSmartCategory)) {
            maxConfidence = Math.min(maxConfidence + 20, 100);
        }
        else if (maxConfidence < 30) {
            bestSmartCategory = 'OTHER_INCOME';
            mappedCategory = 'MISCELLANEOUS';
            maxConfidence = 60;
        }
    }
    // Boost confidence for strong keyword matches
    const strongKeywords = [
        'salary', 'rent', 'uber', 'ola', 'zomato', 'swiggy', 'amazon', 'flipkart',
        'netflix', 'spotify', 'electricity', 'recharge', 'fuel', 'petrol'
    ];
    const hasStrongKeyword = strongKeywords.some(keyword => lowerDesc.includes(keyword.toLowerCase()));
    if (hasStrongKeyword && maxConfidence > 0) {
        maxConfidence = Math.min(maxConfidence + 15, 100);
    }
    // Minimum confidence threshold
    if (maxConfidence < 20 && matchedPatterns === 0) {
        maxConfidence = 10; // Low confidence for fallback classification
    }
    return {
        smartCategory: bestSmartCategory,
        category: mappedCategory,
        type: bestType,
        confidence: Math.round(maxConfidence),
        transactionNature
    };
};
exports.classifyTransaction = classifyTransaction;
