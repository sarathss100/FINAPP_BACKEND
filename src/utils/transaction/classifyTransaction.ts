// import { TransactionCategory } from 'model/transaction/interfaces/ITransaction';
// import { SMART_CATEGORIES } from 'model/transaction/interfaces/ITransaction';

// export type TransactionSmartCategory = typeof SMART_CATEGORIES[number];

// type TransactionType = 'REGULAR' | 'TRANSFER' | 'PAYMENT' | 'ADJUSTMENT' | 'FEE' | 'REFUND' | 'DEPOSIT' | 
//     'WITHDRAWAL' | 'INTEREST' | 'DIVIDEND' | 'REWARD' | 'BONUS' | 'CASHBACK' | 'REDEMPTION' | 
//     'CONVERSION' | 'EXCHANGE' | 'LOAN' | 'BORROWING' | 'LENDING' | 'INVESTMENT' | 'PURCHASE' | 
//     'SALE' | 'EXTRACTION';
    
// const CATEGORY_REGEX_MAP: Record<TransactionCategory, RegExp[]> = {
//     RENT: [
//         /\b(rent|lease|tenant|landlord|housing|apartment|flat|pg|room rent)\b/i,
//         /\b((?:monthly )?(?:rent|pg))/i,
//         /\b(house rent|flat rent|residential rent|accommodation|lodging|stay|renting|rental)\b/i,
//         /\b(property rent|villa rent|studio rent|1bhk|2bhk|3bhk|duplex rent|penthouse)\b/i,
//         /\b(hostel|dormitory|guest house|service apartment|paying guest|shared accommodation)\b/i,
//         /\b(monthly accommodation|quarterly rent|advance rent|security deposit|maintenance rent)\b/i,
//         /\b(co-living|coliving|zolo|stanza living|your space|nest away|hello world)\b/i,
//         // Indian bank statement patterns
//         /UPI.*RENT/i,
//         /NEFT.*RENT/i,
//         /IMPS.*RENT/i,
//         /PAY.*RENT/i,
//         /TRANSFER.*RENT/i,
//         /MONTHLY.*RENT/i,
//         /ROOM.*RENT/i,
//         /HOUSE.*OWNER/i,
//         /FLAT.*OWNER/i,
//         /ACCOMMODATION.*PAY/i
//     ],
//     FOOD: [
//         /\b(food|restaurant|cafe|meal|dine|eat|lunch|breakfast|dinner|swiggy|zomato|kirana|grocery|bigbasket|reliance fresh|more supermarket|dmart grocery|blinkit|instamart)\b/i,
//         /\b(snacks|beverages|drinks|juice|coffee|tea|ice cream|dessert|bakery|confectionery)\b/i,
//         /\b(fruits|vegetables|meat|chicken|fish|dairy|milk|bread|rice|wheat|cooking oil)\b/i,
//         /\b(takeaway|home delivery|food delivery|online food|quick bite|fast food|junk food)\b/i,
//         /\b(dominos|pizza hut|kfc|mcdonalds|burger king|subway|starbucks|cafe coffee day|barista)\b/i,
//         /\b(grocery store|supermarket|hypermarket|departmental store|provision store|general store)\b/i,
//         /\b(fresh|organic|vegetables|dal|spices|masala|kitchen supplies|cooking ingredients)\b/i,
//         /\b(zepto|dunzo|grofers|amazon fresh|flipkart grocery|jiomart|nature's basket)\b/i,
//         /\b(food court|canteen|mess|tiffin|home food|catering|buffet|fine dining)\b/i,
//         /\b(street food|local food|regional cuisine|north indian|south indian|chinese|continental)\b/i,
//         // Indian bank statement patterns
//         /UPI.*SWIGGY/i,
//         /UPI.*ZOMATO/i,
//         /UPI.*BIGBASKET/i,
//         /UPI.*GROFERS/i,
//         /UPI.*DUNZO/i,
//         /UPI.*BLINKIT/i,
//         /CARD.*SWIGGY/i,
//         /CARD.*ZOMATO/i,
//         /POS.*RESTAURANT/i,
//         /POS.*CAFE/i,
//         /POS.*FOOD/i,
//         /ONLINE.*GROCERY/i,
//         /MERCHANT.*FOOD/i,
//         /PAYMENT.*GROCERY/i,
//         /DMART/i,
//         /MORE RETAIL/i,
//         /RELIANCE RETAIL/i,
//         /SPENCER/i,
//         /WALMART/i
//     ],
//     TRANSPORT: [
//         /\b(uber|lyft|taxi|metro|bus|train|fuel|gas|petrol|car|parking|irctc|railway ticket|ola|meru|rapido|bike rental|auto rickshaw|local transport)\b/i,
//         /\b(diesel|cng|car wash|vehicle service|maintenance|repair|spare parts|tyre)\b/i,
//         /\b(toll|highway|expressway|bridge|parking fee|valet parking|airport parking)\b/i,
//         /\b(public transport|local train|suburban|city bus|volvo|ac bus|sleeper bus)\b/i,
//         /\b(cab|taxi service|ride sharing|car pool|bike taxi|e-rickshaw|tempo|shared auto)\b/i,
//         /\b(flight|domestic flight|international flight|airline|air travel|aviation)\b/i,
//         /\b(indigo|spicejet|air india|vistara|go air|akasa air|jet airways)\b/i,
//         /\b(railway|train ticket|tatkal|premium tatkal|ac coach|sleeper|general)\b/i,
//         /\b(metro card|metro recharge|local pass|monthly pass|travel pass|season ticket)\b/i,
//         /\b(vehicle insurance|car emi|bike emi|rc renewal|fitness certificate|pollution certificate)\b/i,
//         /\b(driving license|dl renewal|rto|registration|vehicle registration|road tax)\b/i,
//         // Indian bank statement patterns
//         /UPI.*OLA/i,
//         /UPI.*UBER/i,
//         /UPI.*RAPIDO/i,
//         /UPI.*IRCTC/i,
//         /CARD.*IRCTC/i,
//         /CARD.*FUEL/i,
//         /CARD.*PETROL/i,
//         /CARD.*DIESEL/i,
//         /POS.*PETROL/i,
//         /POS.*FUEL/i,
//         /INDIAN OIL/i,
//         /BHARAT PETROLEUM/i,
//         /HINDUSTAN PETROLEUM/i,
//         /SHELL/i,
//         /ESSAR/i,
//         /METRO.*CARD/i,
//         /DMRC/i,
//         /KSRTC/i,
//         /MSRTC/i,
//         /BMTC/i,
//         /BEST/i,
//         /PARKING/i,
//         /TOLL/i
//     ],
//     ENTERTAINMENT: [
//         /\b(movie|cinema|netflix|spotify|concert|game|streaming|theater|disney+hotstar|sony liv|alt balaji|mx player|voot|jio cinema)\b/i,
//         /\b(youtube premium|amazon prime video|zee5|eros now|shemaroo|hungama|gaana|wynk)\b/i,
//         /\b(gaming|xbox|playstation|nintendo|steam|epic games|mobile games|in-app purchase)\b/i,
//         /\b(amusement park|theme park|water park|adventure sports|bowling|pool|snooker)\b/i,
//         /\b(live show|stand up comedy|music concert|festival|cultural event|exhibition)\b/i,
//         /\b(multiplexes|pvr|inox|cinepolis|carnival|fun republic|movie ticket|3d movie)\b/i,
//         /\b(sports event|cricket match|football|basketball|tennis|badminton|gym|fitness)\b/i,
//         /\b(books|ebooks|kindle|audible|magazine|newspaper|comics|novel|fiction)\b/i,
//         /\b(hobby|crafts|art supplies|musical instrument|photography|camera|lens)\b/i,
//         /\b(club|pub|bar|nightclub|disco|party|celebration|birthday party|anniversary)\b/i,
//         // Indian bank statement patterns
//         /UPI.*NETFLIX/i,
//         /UPI.*SPOTIFY/i,
//         /UPI.*HOTSTAR/i,
//         /UPI.*PRIME/i,
//         /CARD.*NETFLIX/i,
//         /CARD.*SPOTIFY/i,
//         /CARD.*HOTSTAR/i,
//         /PVR/i,
//         /INOX/i,
//         /CINEPOLIS/i,
//         /CARNIVAL/i,
//         /MOVIE/i,
//         /CINEMA/i,
//         /GOOGLE PLAY/i,
//         /APP STORE/i,
//         /STEAM/i,
//         /PLAYSTATION/i,
//         /XBOX/i
//     ],
//     HEALTH: [
//         /\b(hospital|clinic|pharma|medicine|doctor|health|prescription|dentist|apollo|fortis|max healthcare|chemist)\b/i,
//         /\b(medical|surgery|operation|treatment|therapy|consultation|checkup|diagnostic)\b/i,
//         /\b(lab test|blood test|x-ray|mri|ct scan|ultrasound|pathology|radiology)\b/i,
//         /\b(pharmacy|medical store|drug|tablet|capsule|syrup|injection|vaccine)\b/i,
//         /\b(health insurance|mediclaim|family floater|critical illness|dental care)\b/i,
//         /\b(ayurveda|homeopathy|physiotherapy|yoga|meditation|wellness|spa)\b/i,
//         /\b(eye care|dental|orthodontic|dermatology|cardiology|neurology|oncology)\b/i,
//         /\b(ambulance|emergency|icu|ot|operation theater|nursing|ward)\b/i,
//         // Indian bank statement patterns
//         /UPI.*APOLLO/i,
//         /UPI.*FORTIS/i,
//         /UPI.*MAX/i,
//         /UPI.*PHARMA/i,
//         /UPI.*MEDICAL/i,
//         /UPI.*HOSPITAL/i,
//         /CARD.*HOSPITAL/i,
//         /CARD.*MEDICAL/i,
//         /CARD.*PHARMA/i,
//         /POS.*PHARMACY/i,
//         /POS.*MEDICAL/i,
//         /APOLLO.*PHARMACY/i,
//         /MEDPLUS/i,
//         /NETMEDS/i,
//         /1MG/i,
//         /PHARMEASY/i,
//         /DR.*REDDY/i,
//         /CIPLA/i,
//         /SUN PHARMA/i
//     ],
//     EDUCATION: [
//         /\b(school|college|university|course|tuition|book|library|exam|coaching|vedantu|byju's|unacademy|gradeup)\b/i,
//         /\b(education|academic|study|student|learning|training|workshop|seminar)\b/i,
//         /\b(fees|admission|registration|enrollment|certificate|degree|diploma)\b/i,
//         /\b(textbook|reference book|notebook|stationery|pen|pencil|calculator)\b/i,
//         /\b(online course|e-learning|udemy|coursera|khan academy|skill development)\b/i,
//         /\b(coaching center|tutorial|classes|private tuition|group study|mentoring)\b/i,
//         /\b(language course|computer course|programming|coding|software training)\b/i,
//         /\b(competitive exam|entrance exam|mock test|practice test|study material)\b/i,
//         // Indian bank statement patterns
//         /UPI.*BYJU/i,
//         /UPI.*VEDANTU/i,
//         /UPI.*UNACADEMY/i,
//         /UPI.*SCHOOL/i,
//         /UPI.*COLLEGE/i,
//         /UPI.*FEES/i,
//         /CARD.*SCHOOL/i,
//         /CARD.*COLLEGE/i,
//         /CARD.*FEES/i,
//         /EDUCATION.*FEE/i,
//         /TUITION.*FEE/i,
//         /ADMISSION.*FEE/i,
//         /EXAM.*FEE/i,
//         /COURSE.*FEE/i,
//         /TRAINING.*FEE/i,
//         /COACHING.*FEE/i
//     ],
//     SHOPPING: [
//         /\b(amazon|flipkart|myntra|ebay|shopping|retail|store|buy|purchase|ajio|limeroad|nykaa|meesho|firstcry|tata cliq|shoppers stop)\b/i,
//         /\b(clothing|fashion|apparel|shoes|accessories|jewelry|watch|bag|wallet)\b/i,
//         /\b(electronics|mobile|laptop|tablet|headphones|speaker|camera|tv)\b/i,
//         /\b(home appliances|furniture|kitchen|utensils|decoration|bedding|curtains)\b/i,
//         /\b(cosmetics|beauty|skincare|makeup|perfume|shampoo|soap|lotion)\b/i,
//         /\b(toys|games|baby products|kids|children|infant|maternity)\b/i,
//         /\b(books|music|movies|dvd|cd|vinyl|merchandise|collectibles)\b/i,
//         /\b(sports|fitness|gym equipment|outdoor|camping|cycling|running)\b/i,
//         // Indian bank statement patterns
//         /UPI.*AMAZON/i,
//         /UPI.*FLIPKART/i,
//         /UPI.*MYNTRA/i,
//         /UPI.*NYKAA/i,
//         /UPI.*AJIO/i,
//         /UPI.*MEESHO/i,
//         /CARD.*AMAZON/i,
//         /CARD.*FLIPKART/i,
//         /CARD.*MYNTRA/i,
//         /POS.*SHOPPING/i,
//         /POS.*RETAIL/i,
//         /SHOPPERS STOP/i,
//         /LIFESTYLE/i,
//         /WESTSIDE/i,
//         /PANTALOONS/i,
//         /BIG BAZAAR/i,
//         /CENTRAL/i,
//         /BRAND FACTORY/i,
//         /TATA CLIQ/i,
//         /PAYTM MALL/i,
//         /SNAPDEAL/i
//     ],
//     TRAVEL: [
//         /\b(flight|hotel|airbnb|trip|vacation|travel|journey|holiday|goibibo|makemytrip|oyo|cleartrip|redbus|ixigo)\b/i,
//         /\b(booking|reservation|accommodation|lodging|resort|guest house)\b/i,
//         /\b(tour|package|itinerary|sightseeing|guide|travel agent)\b/i,
//         /\b(visa|passport|travel insurance|forex|currency exchange)\b/i,
//         /\b(luggage|baggage|travel bag|suitcase|backpack|travel gear)\b/i,
//         /\b(international travel|domestic travel|business travel|leisure travel)\b/i,
//         /\b(cruise|ship|ferry|boat|water transport|sea travel)\b/i,
//         // Indian bank statement patterns
//         /UPI.*MAKEMYTRIP/i,
//         /UPI.*GOIBIBO/i,
//         /UPI.*OYO/i,
//         /UPI.*CLEARTRIP/i,
//         /UPI.*IXIGO/i,
//         /UPI.*REDBUS/i,
//         /CARD.*MAKEMYTRIP/i,
//         /CARD.*GOIBIBO/i,
//         /CARD.*OYO/i,
//         /CARD.*HOTEL/i,
//         /CARD.*AIRLINE/i,
//         /INDIGO/i,
//         /SPICEJET/i,
//         /AIR INDIA/i,
//         /VISTARA/i,
//         /GO FIRST/i,
//         /AKASA AIR/i,
//         /TRAVEL.*BOOKING/i,
//         /HOTEL.*BOOKING/i,
//         /FLIGHT.*BOOKING/i
//     ],
//     BILLS: [
//         /\b(electricity|water|gas|internet|phone|utility|bill|postpaid|bsnl|jio|airtel|vi|vodafone|tneb|bescom|adsl|broadband|mobile recharge|dth|dish tv|sun direct)\b/i,
//         /\b(cable tv|satellite tv|fiber|wifi|landline|telephone|mobile bill)\b/i,
//         /\b(lpg|cylinder|cooking gas|piped gas|compressed gas)\b/i,
//         /\b(municipal tax|property tax|water tax|sewerage|garbage collection)\b/i,
//         /\b(maintenance|society|apartment|housing society|flat maintenance)\b/i,
//         /\b(insurance premium|life insurance|health insurance|motor insurance)\b/i,
//         // Indian bank statement patterns
//         /UPI.*ELECTRICITY/i,
//         /UPI.*WATER/i,
//         /UPI.*GAS/i,
//         /UPI.*INTERNET/i,
//         /UPI.*BROADBAND/i,
//         /UPI.*RECHARGE/i,
//         /UPI.*JIO/i,
//         /UPI.*AIRTEL/i,
//         /UPI.*VI/i,
//         /UPI.*VODAFONE/i,
//         /UPI.*BSNL/i,
//         /CARD.*RECHARGE/i,
//         /BILL.*PAYMENT/i,
//         /ELECTRICITY.*BILL/i,
//         /WATER.*BILL/i,
//         /GAS.*BILL/i,
//         /INTERNET.*BILL/i,
//         /MOBILE.*BILL/i,
//         /DTH.*RECHARGE/i,
//         /TATA SKY/i,
//         /DISH TV/i,
//         /SUN DIRECT/i,
//         /VIDEOCON/i,
//         /TNEB/i,
//         /BESCOM/i,
//         /MSEB/i,
//         /PSEB/i,
//         /KSEB/i,
//         /BSES/i,
//         /RELIANCE ENERGY/i,
//         /TATA POWER/i
//     ],
//     SUBSCRIPTIONS: [
//         /\b(subscription|monthly|yearly|recurring|prime|plus|membership|ad-free|unlimited|ott|netflix plan|spotify premium|primevideo|apple plus|magazine subscription)\b/i,
//         /\b(annual subscription|premium account|pro version|paid plan|upgrade)\b/i,
//         /\b(software subscription|app subscription|cloud storage|online service)\b/i,
//         /\b(news subscription|digital magazine|e-paper|online content)\b/i,
//         /\b(fitness subscription|gym membership|yoga class|diet plan)\b/i,
//         /\b(music streaming|video streaming|podcast|audiobook)\b/i,
//         // Indian bank statement patterns
//         /UPI.*SUBSCRIPTION/i,
//         /UPI.*MEMBERSHIP/i,
//         /UPI.*PREMIUM/i,
//         /CARD.*SUBSCRIPTION/i,
//         /RECURRING.*PAYMENT/i,
//         /MONTHLY.*SUBSCRIPTION/i,
//         /ANNUAL.*SUBSCRIPTION/i,
//         /AUTO.*RENEWAL/i,
//         /NETFLIX.*SUBSCRIPTION/i,
//         /SPOTIFY.*PREMIUM/i,
//         /AMAZON.*PRIME/i,
//         /DISNEY.*HOTSTAR/i,
//         /YOUTUBE.*PREMIUM/i,
//         /OFFICE.*365/i,
//         /ADOBE.*CREATIVE/i,
//         /GOOGLE.*ONE/i,
//         /ICLOUD/i,
//         /DROPBOX/i
//     ],
//     GIFTS: [
//         /\b(gift|present|donation|charity|donate|birthday gift|anniversary|festival donation|seva|temple donation|ngo|trust|contributions)\b/i,
//         /\b(wedding gift|baby shower|housewarming|farewell|congratulations)\b/i,
//         /\b(religious donation|temple|mosque|church|gurudwara|monastery)\b/i,
//         /\b(charity|ngo|non profit|social cause|fundraising|crowdfunding)\b/i,
//         /\b(festival|diwali|christmas|eid|holi|durga puja|ganesh chaturthi)\b/i,
//         /\b(gift card|voucher|gift certificate|surprise|celebration)\b/i,
//         // Indian bank statement patterns
//         /UPI.*GIFT/i,
//         /UPI.*DONATION/i,
//         /UPI.*CHARITY/i,
//         /UPI.*TEMPLE/i,
//         /UPI.*TRUST/i,
//         /TRANSFER.*GIFT/i,
//         /TRANSFER.*DONATION/i,
//         /DONATION.*TO/i,
//         /CHARITY.*PAYMENT/i,
//         /TEMPLE.*DONATION/i,
//         /RELIGIOUS.*DONATION/i,
//         /NGO.*DONATION/i,
//         /TRUST.*DONATION/i,
//         /FESTIVAL.*GIFT/i,
//         /BIRTHDAY.*GIFT/i,
//         /WEDDING.*GIFT/i
//     ],
//     SAVINGS: [
//         /\b(savings|deposit|locker|safe|stash|fixed deposit|fd|rd|recurring deposit|savings account|balance)\b/i,
//         /\b(emergency fund|contingency|rainy day|future planning|nest egg)\b/i,
//         /\b(bank deposit|cash deposit|cheque deposit|term deposit|time deposit)\b/i,
//         /\b(safe deposit locker|bank locker|vault|secure storage)\b/i,
//         /\b(goal based saving|child education|retirement planning|wedding fund)\b/i,
//         // Indian bank statement patterns
//         /TRANSFER.*SAVINGS/i,
//         /TRANSFER.*FD/i,
//         /TRANSFER.*RD/i,
//         /DEPOSIT.*SAVINGS/i,
//         /FD.*DEPOSIT/i,
//         /RD.*DEPOSIT/i,
//         /RECURRING.*DEPOSIT/i,
//         /FIXED.*DEPOSIT/i,
//         /SAVINGS.*ACCOUNT/i,
//         /TERM.*DEPOSIT/i,
//         /TIME.*DEPOSIT/i,
//         /LOCKER.*RENT/i,
//         /SAFE.*DEPOSIT/i,
//         /VAULT.*CHARGES/i
//     ],
//     INVESTMENTS: [
//         /\b(stock|bond|mutual fund|portfolio|invest|brokerage|sip|nps|elss|ulip|pension scheme|share market|trading account|zerodha|upstox|groww|coin dcg)\b/i,
//         /\b(equity|shares|securities|debentures|government bonds|corporate bonds)\b/i,
//         /\b(systematic investment plan|lump sum|dividend reinvestment|capital gains)\b/i,
//         /\b(ipo|initial public offering|rights issue|bonus issue|stock split)\b/i,
//         /\b(commodity|gold etf|silver|precious metals|real estate investment)\b/i,
//         /\b(retirement planning|pension fund|provident fund|gratuity)\b/i,
//         /\b(tax saving|tax benefit|80c|elss mutual fund|nsc|ppf)\b/i,
//         // Indian bank statement patterns
//         /UPI.*ZERODHA/i,
//         /UPI.*UPSTOX/i,
//         /UPI.*GROWW/i,
//         /UPI.*PAYTM MONEY/i,
//         /UPI.*COIN/i,
//         /UPI.*SIP/i,
//         /UPI.*MUTUAL FUND/i,
//         /CARD.*ZERODHA/i,
//         /CARD.*UPSTOX/i,
//         /TRANSFER.*SIP/i,
//         /TRANSFER.*INVESTMENT/i,
//         /SIP.*PAYMENT/i,
//         /MUTUAL.*FUND/i,
//         /STOCK.*PURCHASE/i,
//         /EQUITY.*INVESTMENT/i,
//         /BOND.*PURCHASE/i,
//         /NPS.*CONTRIBUTION/i,
//         /PPF.*DEPOSIT/i,
//         /ELSS.*INVESTMENT/i,
//         /GOLD.*ETF/i,
//         /TRADING.*ACCOUNT/i
//     ],
//     MISCELLANEOUS: [
//         /\b(miscellaneous|other|general|unclassified|unknown|various)\b/i,
//         /\b(personal|family|household|domestic|private)\b/i,
//         /\b(cash|atm|withdrawal|deposit|transfer|payment)\b/i,
//         /\b(fees|charges|penalty|fine|tax|government)\b/i,
//         /\b(service|maintenance|repair|professional|consultation)\b/i,
//         // Catch-all patterns for unmatched transactions
//         /UPI.*TO/i,
//         /UPI.*FROM/i,
//         /NEFT.*TO/i,
//         /NEFT.*FROM/i,
//         /IMPS.*TO/i,
//         /IMPS.*FROM/i,
//         /RTGS.*TO/i,
//         /RTGS.*FROM/i,
//         /CASH.*WITHDRAWAL/i,
//         /CASH.*DEPOSIT/i,
//         /ATM.*WITHDRAWAL/i,
//         /POS.*PURCHASE/i,
//         /ONLINE.*PURCHASE/i,
//         /MERCHANT.*PAYMENT/i,
//         /SERVICE.*CHARGE/i,
//         /BANK.*CHARGES/i,
//         /PROCESSING.*FEE/i,
//         /MAINTENANCE.*CHARGE/i
//     ]
// };

// const TYPE_REGEX_MAP: Record<TransactionType, RegExp[]> = {
//     REGULAR: [
//         /\b(debit|credit|transaction|purchase|expense|payment made|money spent|transfer done|used card|card payment|online purchase|cash purchase)\b/i,
//         /\b(pos transaction|merchant payment|contactless payment|tap payment|chip payment|swipe payment|pin transaction)\b/i,
//         /\b(bill payment|utility payment|recharge|mobile recharge|dth recharge|broadband payment|electricity bill)\b/i,
//         /\b(grocery purchase|fuel purchase|restaurant bill|shopping|medical expense|pharmacy purchase)\b/i,
//         /\b(subscription fee|membership fee|annual fee|renewal fee|maintenance charge|service fee)\b/i
//     ],
//     TRANSFER: [
//         /\b(transfer|sent|received|moved|transferred|bank transfer|wire transfer|imps|neft|rtgs|upi transfer|google pay|phonepe|paytm|bhim upi|to contact|from contact)\b/i,
//         /\b(fund transfer|inter bank transfer|same bank transfer|immediate transfer|scheduled transfer)\b/i,
//         /\b(p2p transfer|peer to peer|person to person|family transfer|friend transfer)\b/i,
//         /\b(salary transfer|bulk transfer|corporate transfer|vendor payment|supplier payment)\b/i,
//         /\b(quick transfer|instant transfer|real time transfer|nach transfer|ecs transfer)\b/i,
//         /\b(upi id|vpa|qr code|bharat qr|scan and pay|pay by phone|pay by number)\b/i,
//         /\b(money sent to|money received from|amount transferred to|funds moved to)\b/i
//     ],
//     PAYMENT: [
//         /\b(payment|paid|settle|clear|remittance|cleared dues|made payment|processed payment|amount paid|full payment|partial payment)\b/i,
//         /\b(bill settled|invoice paid|dues cleared|outstanding cleared|liability settled)\b/i,
//         /\b(loan payment|emi payment|credit card payment|insurance premium|mutual fund sip)\b/i,
//         /\b(tax payment|advance tax|tds payment|gst payment|income tax|property tax)\b/i,
//         /\b(school fee|college fee|tuition fee|exam fee|admission fee|course fee)\b/i,
//         /\b(rent payment|maintenance payment|society payment|apartment payment)\b/i
//     ],
//     ADJUSTMENT: [
//         /\b(adjustment|correction|modify|update|reversed|refund adjusted|chargeback|error correction|ledger adjustment)\b/i,
//         /\b(balance adjustment|account adjustment|reconciliation|settlement adjustment)\b/i,
//         /\b(dispute resolution|claim adjustment|insurance adjustment|penalty reversal)\b/i,
//         /\b(system correction|manual adjustment|auto adjustment|periodic adjustment)\b/i,
//         /\b(overdraft adjustment|minimum balance adjustment|interest adjustment)\b/i
//     ],
//     FEE: [
//         /\b(fee|charge|commission|processing|handling|service charge|bank charges|gst on fee|convenience fee|penalty|late fee|emi processing)\b/i,
//         /\b(atm fee|pos fee|transaction fee|transfer fee|sms charges|alert charges)\b/i,
//         /\b(annual maintenance|account maintenance|demat charges|trading charges)\b/i,
//         /\b(cheque book charges|dd charges|po charges|locker rent|safe deposit)\b/i,
//         /\b(overdraft charges|bounce charges|return charges|stop payment charges)\b/i,
//         /\b(forex charges|foreign transaction fee|markup charges|cross currency)\b/i,
//         /\b(gst|service tax|stamp duty|registration fee|processing charges)\b/i
//     ],
//     REFUND: [
//         /\b(refund|rebate|return|credited back|returned amount|order cancelled|reversal|payment returned|refund processed|refund initiated)\b/i,
//         /\b(transaction reversed|amount reversed|auto reversal|manual reversal)\b/i,
//         /\b(merchant refund|vendor refund|service refund|booking cancelled)\b/i,
//         /\b(insurance claim|claim settlement|compensation|reimbursement)\b/i,
//         /\b(excess amount returned|duplicate payment reversed|overpayment refund)\b/i,
//         /\b(failed transaction reversed|timeout reversal|cancelled order refund)\b/i
//     ],
//     DEPOSIT: [
//         /\b(deposit|added|loaded|top up|fund added|bank deposit|cash deposit|cheque deposit|neft deposit|imps deposit|savings deposit|wallet topup)\b/i,
//         /\b(salary credited|pension credited|bonus credited|increment credited)\b/i,
//         /\b(fd deposit|recurring deposit|fixed deposit|term deposit|time deposit)\b/i,
//         /\b(cheque cleared|dd credited|po credited|inward clearing)\b/i,
//         /\b(income credited|commission credited|freelance payment|consultancy fee)\b/i,
//         /\b(rental income|property income|business income|trading profit)\b/i,
//         /\b(government benefit|subsidy|scholarship|grant|pension)\b/i,
//         /\b(wallet reload|prepaid recharge|gift card loaded|points added)\b/i
//     ],
//     WITHDRAWAL: [
//         /\b(withdrawal|withdraw|taken out|cash out|cash withdrawal|atm withdrawal|bank withdrawal|debit cash|withdraw funds|cash withdrawn|point of sale)\b/i,
//         /\b(branch withdrawal|counter withdrawal|teller withdrawal|manual withdrawal)\b/i,
//         /\b(atm cash|atm debit|cash dispensed|cash collected|cash pickup)\b/i,
//         /\b(self withdrawal|third party withdrawal|authorized withdrawal)\b/i,
//         /\b(emergency withdrawal|bulk withdrawal|large withdrawal|cash advance)\b/i,
//         /\b(pos cash|cashback at pos|merchant cash|retail withdrawal)\b/i
//     ],
//     INTEREST: [
//         /\b(interest|accrued|earned interest|interest credited|fd interest|savings interest|loan interest|compound interest|simple interest|bank interest)\b/i,
//         /\b(term deposit interest|recurring deposit interest|daily interest|monthly interest)\b/i,
//         /\b(quarterly interest|annual interest|maturity interest|accumulated interest)\b/i,
//         /\b(penalty interest|penal interest|default interest|late payment interest)\b/i,
//         /\b(ppf interest|nsc interest|kisan vikas patra|postal savings interest)\b/i,
//         /\b(overdraft interest|loan interest|credit interest|debit interest)\b/i
//     ],
//     DIVIDEND: [
//         /\b(dividend|shareholder|payout|stock dividend|bonus shares|dividend received|company payout|quarterly dividend|annual dividend|equity dividend)\b/i,
//         /\b(mutual fund dividend|unit dividend|nav dividend|scheme dividend)\b/i,
//         /\b(interim dividend|final dividend|special dividend|extra dividend)\b/i,
//         /\b(corporate dividend|dividend distribution|dividend income|dividend warrant)\b/i,
//         /\b(bonus issue|rights issue|share split|stock split)\b/i
//     ],
//     REWARD: [
//         /\b(reward|points|bonus points|cashback|loyalty reward|reward points|gift points|reward redemption|reward bonus|offer reward|exclusive offer)\b/i,
//         /\b(credit card rewards|debit card rewards|loyalty points|membership rewards)\b/i,
//         /\b(shopping rewards|fuel rewards|dining rewards|travel rewards)\b/i,
//         /\b(milestone bonus|anniversary bonus|welcome bonus|sign up bonus)\b/i,
//         /\b(tier benefits|premium rewards|gold benefits|platinum benefits)\b/i
//     ],
//     BONUS: [
//         /\b(bonus|incentive|extra payment|festival bonus|diwali bonus|performance bonus|joining bonus|referral bonus|employee bonus|year end bonus|special incentive)\b/i,
//         /\b(diwali bonus|eid bonus|christmas bonus|new year bonus|holi bonus)\b/i,
//         /\b(productivity bonus|target bonus|sales bonus|achievement bonus)\b/i,
//         /\b(retention bonus|loyalty bonus|long service bonus|completion bonus)\b/i,
//         /\b(festival allowance|special allowance|ad hoc bonus|ex gratia)\b/i
//     ],
//     CASHBACK: [
//         /\b(cashback|rebate|discount back|instant cashback|offer cashback|promo cashback|upi cashback|credit card cashback|debit card cashback|reward cashback)\b/i,
//         /\b(merchant cashback|category cashback|fuel cashback|grocery cashback)\b/i,
//         /\b(festival cashback|weekend cashback|special cashback|bonus cashback)\b/i,
//         /\b(app cashback|digital cashback|online cashback|pos cashback)\b/i,
//         /\b(percentage cashback|flat cashback|tiered cashback|promotional cashback)\b/i
//     ],
//     REDEMPTION: [
//         /\b(redeem|used points|voucher|coupon|redeemed|claim voucher|apply coupon|use discount|gift card redeemed|points redeemed|offer claimed|promo used)\b/i,
//         /\b(reward redemption|points redemption|miles redemption|loyalty redemption)\b/i,
//         /\b(gift voucher|shopping voucher|dining voucher|fuel voucher|travel voucher)\b/i,
//         /\b(discount coupon|promo code|offer code|referral code|cashback voucher)\b/i,
//         /\b(membership benefits|tier benefits|privilege redemption|exclusive offer)\b/i
//     ],
//     CONVERSION: [
//         /\b(convert|exchange|swap|token swap|crypto conversion|coin conversion|currency swap|digital rupee exchange|token migration|asset conversion)\b/i,
//         /\b(currency conversion|forex conversion|foreign exchange|fx swap)\b/i,
//         /\b(crypto to fiat|fiat to crypto|coin swap|token exchange)\b/i,
//         /\b(portfolio rebalancing|asset reallocation|fund switch|scheme switch)\b/i,
//         /\b(mutual fund switch|sip switch|plan conversion|option conversion)\b/i
//     ],
//     EXCHANGE: [
//         /\b(exchange rate|forex|currency exchange|foreign exchange|intl currency|usd to inr|eur to inr|convert foreign|exchange transaction|fx conversion|forex trade)\b/i,
//         /\b(cross currency|multi currency|foreign currency|overseas transaction)\b/i,
//         /\b(remittance|outward remittance|inward remittance|international transfer)\b/i,
//         /\b(liberalised remittance|lrs|foreign travel|overseas education)\b/i,
//         /\b(export proceeds|import payment|trade finance|letter of credit)\b/i
//     ],
//     LOAN: [
//         /\b(loan|borrow|lend|financing|emi|personal loan|home loan|car loan|gold loan|business loan|education loan|loan disbursed|loan sanctioned|loan application)\b/i,
//         /\b(vehicle loan|two wheeler loan|consumer loan|mortgage loan|housing loan)\b/i,
//         /\b(loan against property|loan against securities|overdraft|credit line)\b/i,
//         /\b(term loan|working capital|cash credit|bill discounting|trade finance)\b/i,
//         /\b(msme loan|mudra loan|stand up india|startup loan|agriculture loan)\b/i,
//         /\b(kisan credit card|crop loan|dairy loan|poultry loan|fisheries loan)\b/i,
//         /\b(loan disbursement|loan sanction|loan approval|loan processing)\b/i
//     ],
//     BORROWING: [
//         /\b(borrow|debt|owe|loan taken|took loan|borrow money|need loan|borrowed|loan availed|loan amount|borrow from friend|loan request)\b/i,
//         /\b(credit availed|credit utilized|credit drawn|overdraft used)\b/i,
//         /\b(advance taken|salary advance|travel advance|expense advance)\b/i,
//         /\b(emergency loan|instant loan|quick loan|payday loan)\b/i,
//         /\b(peer lending|p2p borrowing|family loan|friend loan|personal borrowing)\b/i
//     ],
//     LENDING: [
//         /\b(lend|give loan|loan provided|lent|lending|loan given|peer to peer lending|p2p lending|give money|lend money|provide loan|money given as loan)\b/i,
//         /\b(family lending|friend lending|personal lending|private lending)\b/i,
//         /\b(advance given|money lent|amount lent|funds provided)\b/i,
//         /\b(lending income|lending interest|lending profit|lending return)\b/i
//     ],
//     INVESTMENT: [
//         /\b(invest|buy stock|buy bond|allocate|investment made|sip started|invested in mf|stock purchase|mutual fund buy|portfolio addition|capital allocation|investment purchase)\b/i,
//         /\b(equity investment|debt investment|hybrid investment|balanced fund)\b/i,
//         /\b(sip|systematic investment|lumpsum investment|additional investment)\b/i,
//         /\b(nifty|sensex|stock market|share market|equity market|capital market)\b/i,
//         /\b(mutual fund|mf|index fund|etf|exchange traded fund|unit purchase)\b/i,
//         /\b(ppf|epf|nps|national pension|provident fund|retirement fund)\b/i,
//         /\b(elss|tax saving|tax benefit|80c investment|tax planning)\b/i,
//         /\b(gold etf|gold fund|commodity|real estate|reits|infrastructure)\b/i,
//         /\b(ipo|initial public offer|rights issue|follow on offer|nfo)\b/i
//     ],
//     PURCHASE: [
//         /\b(bought|acquired|purchased|made purchase|purchase order|buy online|buy offline|shop purchase|product bought|item purchased|bought item|purchased product)\b/i,
//         /\b(retail purchase|wholesale purchase|bulk purchase|business purchase)\b/i,
//         /\b(grocery shopping|clothing purchase|electronics purchase|furniture purchase)\b/i,
//         /\b(medicine purchase|pharmacy|medical purchase|health purchase)\b/i,
//         /\b(book purchase|education material|stationery|office supplies)\b/i,
//         /\b(gift purchase|festival shopping|wedding shopping|celebration purchase)\b/i,
//         /\b(vehicle purchase|property purchase|land purchase|house purchase)\b/i
//     ],
//     SALE: [
//         /\b(sold|disposed|liquidated|sale completed|item sold|product sold|sell order|sold item|second hand sell|resell|marketplace sell|sold goods|sales receipt)\b/i,
//         /\b(business sale|product sale|service sale|commission sale)\b/i,
//         /\b(online sale|offline sale|marketplace sale|direct sale)\b/i,
//         /\b(vehicle sale|property sale|asset sale|investment sale)\b/i,
//         /\b(wholesale|retail sale|bulk sale|export sale|domestic sale)\b/i,
//         /\b(consignment sale|auction sale|tender sale|government sale)\b/i
//     ],
//     EXTRACTION: [
//         /\b(mined|extracted|harvested|yielded|mining income|crypto mined|block reward|mining reward|farm yield|defi yield|liquidity mining|pool rewards)\b/i,
//         /\b(agricultural yield|crop harvest|dairy produce|livestock income)\b/i,
//         /\b(mining operation|quarry income|natural resource|mineral extraction)\b/i,
//         /\b(staking reward|validator reward|node reward|consensus reward)\b/i,
//         /\b(yield farming|liquidity provision|defi farming|protocol reward)\b/i
//     ]
// };

// const matchRegex = function (
//     description: string,
//     regexMap: Record<string, RegExp[]>,
//     defaultValue: string
// ): string {
//     if (!description) return defaultValue;
    
//     const lowerDesc = description.toLowerCase();
//     for (const [key, patterns] of Object.entries(regexMap)) {
//         if (patterns.some(pattern => pattern.test(lowerDesc))) {
//             return key;
//         }
//     }
//     return defaultValue; 
// }

// export const classifyTransaction = function (description: string): {
//     category: TransactionCategory;
//     type: TransactionType;
// } {
//     if (!description) return {
//         category: 'MISCELLANEOUS' as TransactionCategory,
//         type: 'REGULAR' as TransactionType
//     };

//     const matchedCategory = matchRegex(description, CATEGORY_REGEX_MAP, 'MISCELLANEOUS');
//     const matchedType = matchRegex(description, TYPE_REGEX_MAP, 'REGULAR');

//     return {
//         category: matchedCategory as TransactionCategory,
//         type: matchedType as TransactionType
//     };
// }

import { SMART_CATEGORIES } from 'model/transaction/interfaces/ITransaction';
import { TransactionCategory } from 'model/transaction/interfaces/ITransaction';

export type TransactionSmartCategory = typeof SMART_CATEGORIES[number];

type TransactionType = 'REGULAR' | 'TRANSFER' | 'PAYMENT' | 'ADJUSTMENT' | 'FEE' | 'REFUND' | 'DEPOSIT' | 
    'WITHDRAWAL' | 'INTEREST' | 'DIVIDEND' | 'REWARD' | 'BONUS' | 'CASHBACK' | 'REDEMPTION' | 
    'CONVERSION' | 'EXCHANGE' | 'LOAN' | 'BORROWING' | 'LENDING' | 'INVESTMENT' | 'PURCHASE' | 
    'SALE' | 'EXTRACTION';

// Enhanced regex patterns combining both systems with improved intelligence
const ENHANCED_CATEGORY_PATTERNS: Record<TransactionSmartCategory, RegExp[]> = {
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
const TYPE_PATTERNS: Record<TransactionType, RegExp[]> = {
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
const CATEGORY_SMART_MAPPING: Record<TransactionCategory, TransactionSmartCategory> = {
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
const matchPatterns = (description: string, patterns: RegExp[]): boolean => {
    if (!description || patterns.length === 0) return false;
    const lowerDesc = description.toLowerCase();
    return patterns.some(pattern => pattern.test(lowerDesc));
};

// Determine transaction nature (income/expense)
const determineTransactionNature = (description: string, amount?: number): 'INCOME' | 'EXPENSE' => {
    if (amount !== undefined) {
        return amount > 0 ? 'INCOME' : 'EXPENSE';
    }
    
    const hasIncomeIndicator = matchPatterns(description, INCOME_INDICATORS);
    const hasExpenseIndicator = matchPatterns(description, EXPENSE_INDICATORS);
    
    if (hasIncomeIndicator && !hasExpenseIndicator) return 'INCOME';
    if (hasExpenseIndicator && !hasIncomeIndicator) return 'EXPENSE';
    
    // Default to expense if unclear
    return 'EXPENSE';
};

// Enhanced classification function
export const classifyTransaction = function (
    description: string, 
    amount?: number
): {
    smartCategory: TransactionSmartCategory;
    category: TransactionCategory;
    type: TransactionType;
    confidence: number;
    transactionNature: 'INCOME' | 'EXPENSE';
} {
    if (!description) {
        return {
            smartCategory: 'MISCELLANEOUS' as TransactionSmartCategory,
            category: 'MISCELLANEOUS' as TransactionCategory,
            type: 'REGULAR' as TransactionType,
            confidence: 0,
            transactionNature: amount && amount > 0 ? 'INCOME' : 'EXPENSE'
        };
    }

    const transactionNature = determineTransactionNature(description, amount);
    const lowerDesc = description.toLowerCase();
    
    let bestSmartCategory: TransactionSmartCategory = 'MISCELLANEOUS';
    let bestType: TransactionType = 'REGULAR';
    let maxConfidence = 0;
    let matchedPatterns = 0;

    // Classify smart category
    for (const [category, patterns] of Object.entries(ENHANCED_CATEGORY_PATTERNS)) {
        if (patterns.length === 0) continue;
        
        const matches = patterns.filter(pattern => pattern.test(lowerDesc));
        if (matches.length > 0) {
            const confidence = (matches.length / patterns.length) * 100;
            if (confidence > maxConfidence) {
                maxConfidence = confidence;
                bestSmartCategory = category as TransactionSmartCategory;
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
                bestType = type as TransactionType;
            }
        }
    }

    // Map smart category to regular category
    let mappedCategory: TransactionCategory = 'MISCELLANEOUS';
    for (const [regularCat, smartCat] of Object.entries(CATEGORY_SMART_MAPPING)) {
        if (smartCat === bestSmartCategory) {
            mappedCategory = regularCat as TransactionCategory;
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
        } else if (maxConfidence < 30) {
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
    
    const hasStrongKeyword = strongKeywords.some(keyword => 
        lowerDesc.includes(keyword.toLowerCase())
    );
    
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
