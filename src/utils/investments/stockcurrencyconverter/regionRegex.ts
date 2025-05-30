import exchangeMap from './exchangeToCurrency.json';

export const extractCountry = function (exchangeName: string): string | null {
  const patterns: RegExp[] = [
    /united\s+states/i,
    /us|usa/i,
    /united\s+kingdom/i,
    /uk/i,
    /germany|deu|de|frankfurt|xetra/i,
    /india|in|national\s+stock\s+exchange|nse|bse/i,
    /canada|tsx|tsv|venture/i,
    /japan|jp|tokyo|tse/i,
    /china|cn|shanghai|szse|sse|shenzhen/i,
    /hong\s+kong|hkg|hse/i,
    /south\s+korea|kr|kospi|korea/i,
    /australia|asx|aus/i,
    /singapore|sgx|singaporean/i,
    /france|euronext|paris|fr/i,
    /switzerland|ch|swe|six/i,
    /spain|madrid|es|sp/i,
    /italy|milan|it|itl/i,
    /brazil|bovespa|br/i,
    /russia|moex|ru/i,
    /saudi\s+arabia|tadawul|sa/i,
    /uae|dubai|abu\s+dhabi|ae/i
  ];

  for (const pattern of patterns) {
    if (pattern.test(exchangeName)) {
      return pattern.toString().match(/\/(.*)\//i)?.[1] || null;
    }
  }

  return null;
}

export const detectCurrencyFromExchange = function (exchangeName: string): string {
  const normalized = exchangeName.toUpperCase();

  if (exchangeMap[normalized as keyof typeof exchangeMap]) {
    return exchangeMap[normalized as keyof typeof exchangeMap];
  }

  const country = extractCountry(exchangeName);
  if (!country) return 'USD';

  switch (country.toLowerCase()) {
    case 'united states':
    case 'us':
      return 'USD';
    case 'united kingdom':
    case 'uk':
      return 'GBP';
    case 'germany':
      return 'EUR';
    case 'canada':
      return 'CAD';
    case 'india':
      return 'INR';
    case 'china':
      return 'CNY';
    case 'japan':
      return 'JPY';
    case 'south korea':
    case 'korea':
      return 'KRW';
    case 'singapore':
      return 'SGD';
    case 'france':
    case 'paris':
      return 'EUR';
    case 'switzerland':
      return 'CHF';
    default:
      return 'USD';
  }
}


