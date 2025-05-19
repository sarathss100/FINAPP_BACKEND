/* eslint-disable no-useless-escape */
// Check if a line looks like a transaction table header
const isHeaderLine = function (line: string) {
    // Skip lines with too many asterisks (often decorative separators)
    if (line.includes('*****') || line.replace(/[^*]/g, '').length > 5) {
      return false;
    }
  
    // List of keywords found in transaction headers
    const keywords = [
      'a/c no',
      'a/c number',
      'acc no',
      'account no',
      'account_number',
      'account name',
      'account_type',
      'account type',
      'account_description',
      'account Description',
      'account Number',
      'account Number',
      'address',
      'amount',
      'amt',
      'available balance',
      'balance',
      'bank',
      'category',
      'chq',
      'chq_num',
      'cheque',
      'closing balance',
      'cr',
      'cr_amt',
      'credit',
      'credit_amt',
      'credit_amount',
      'currency',
      'currency_code',
      'curr_code',
      'date',
      'debit',
      'debit_amt',
      'debit_amount',
      'debit_amt_inr',
      'description',
      'detail',
      'details',
      'details_of_transaction',
      'details_of_transaction',
      'details_of_transaction',
      'drawing power',
      'entry_date',
      'entry_mode',
      'entry_type',
      'from date',
      'from_date',
      'from_date',
      'instrument_id',
      'instr_id',
      'interest rate(% p.a.)',
      'ifs code',
      'ifsc code',
      'micr code',
      'mode',
      'name',
      'narration',
      'narrative',
      'narration',
      'net balance',
      'opening balance',
      'paid in',
      'paid out',
      'particulars',
      'particulars',
      'payment mode',
      'payment_mode',
      'payment type',
      'posting date',
      'posting_date',
      'post_date',
      'remarks',
      'remarks1',
      'remarks2',
      'reference',
      'reference_no',
      'reference_number',
      'ref',
      'ref_no',
      'ref_number',
      'running balance',
      'status',
      'transaction_ref_no',
      'transaction_remarks',
      'trans_remarks',
      'transaction_status',
      'txn_status',
      'transaction_amount',
      'trans_amount',
      'txn_amount',
      'transaction_category',
      'txn_category',
      'transaction_channel',
      'txn_channel',
      'trans_channel',
      'transaction_date',
      'txn_date',
      'value_dt',
      'value_date',
      'tran_date',
      'transaction_date_time',
      'txn_date_time',
      'transaction_details',
      'trans_details',
      'transaction description',
      'transaction_description',
      'txn_description',
      'transaction_desc',
      'transaction_type',
      'trans_type',
      'txn_type',
      'tran_type',
      'to date',
      'to_date',
      'tran_id',
      'transaction_id',
      'txn_id',
      'type',
      'utr',
      'utr_no',
      'utr_number',
      'updated_at',
      'updated_on',
      'value_date',
      'value_date_time',
      'value_today',
      'withdrawal',
      'withdrawal amt',
      'withdrawal_amt',
      'withdrawal_amount',
      'withdrawal_amt_inr',
    ];
  
    // Handle both CSV and fixed-width formats
    let cols = [];
    if (line.includes(',')) {
      cols = line
        .toLowerCase()
        .split(',')
        .map((c) => c.trim());
    } else {
      // For fixed-width formats, split by multiple spaces
      cols = line
        .toLowerCase()
        .split(/\s{2,}/)
        .map((c) => c.trim())
        .filter((c) => c);
    }
  
    // Count how many keywords match
    const matched = keywords.filter((kw) => cols.some((col) => col.includes(kw)));
  
    // Consider it a header if we match enough keywords or detect typical header patterns
    const hasEnoughKeywords = matched.length >= 3;
    const hasTypicalPattern =
      /date.*(?:description|narration|particulars).*(?:debit|credit|amount|withdrawal|deposit)/i.test(
        line
      );
  
    // Special case for HDFC format
    const isHdfcHeader =
      /date.*narration.*chq.*ref.*value.*withdrawal.*deposit.*closing/i.test(
        line.replace(/\s+/g, ' ')
      );
  
    return hasEnoughKeywords || hasTypicalPattern || isHdfcHeader;
};

// Check if a line is a footer or unrelated section
const isFooterLine = function (line: string) {
    const footerPatterns = [
      /^\*{5,}$/, // Line with only asterisks
      /^"/,
      /^Sl\.?\s*No\.?,?/i,
      /^Page\s+\d+\s+of\s+\d+/i,
      /^Total Debits?:/i,
      /^Total Credits?:/i,
      /^Total Amount?:/i,
      /^Opening Balance:/i,
      /^Closing Balance:/i,
      /^Generated(?: on| by):/i,
      /^This is a computer generated/i,
      /^End of Statement/i,
      /^Statement Summary/i,
      /^STATEMENT SUMMARY/i,
      /^For any queries/i,
      /^Disclaimer/i,
      /^Note:/i,
      /^\d+\s+transactions found/i,
      /^-{10,}/, // Long dash lines often indicate end of sections
      /^={10,}/, // Long equals lines often indicate end of sections
    ];
    return footerPatterns.some((pattern) => pattern.test(line));
};

// Check if a line looks like a valid transaction row
const isValidTransactionRow = function (line: string, headerLine: string | null = null) {
    // Skip empty lines
    if (!line.trim()) return false;
  
    // Handle both CSV and fixed-width formats
    let cols = [];
    if (line.includes(',')) {
      cols = line.split(',').map((c) => c.trim());
    } else {
      // For fixed-width formats, split by multiple spaces
      cols = line
        .split(/\s{2,}/)
        .map((c) => c.trim())
        .filter((c) => c);
    }
  
    // Most transaction rows have between 3 and 12 columns
    if (cols.length < 3 || cols.length > 12) return false;
  
    // Check if at least one column has a date-like pattern (DD/MM/YYYY or similar)
    const hasDate = cols.some(
      (col) =>
        /\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(col) || // DD/MM/YYYY
        /\d{2,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}/.test(col) // YYYY/MM/DD
    );
  
    // Check if at least one column has a number (amount or balance)
    const hasAmount = cols.some(
      (col) =>
        /[\d,]+\.\d{2}/.test(col.replace(/[₹₨Rs\s]/gi, '')) || // Matches currency amounts with decimals
        /^\s*[\d,]+\s*$/.test(col) // Matches whole numbers
    );
  
    // If we have a header line and the number of columns matches, it's more likely to be valid
    const matchesHeaderColumns = headerLine
      ? headerLine.split(',').length === cols.length ||
        headerLine.split(/\s{2,}/).filter((c) => c.trim()).length === cols.length
      : false;
  
    return (
      (hasDate && hasAmount) || // Has both date and amount
      (hasDate && cols.length >= 4) || // Has date and enough columns
      (hasAmount && cols.length >= 4) || // Has amount and enough columns
      (matchesHeaderColumns && (hasDate || hasAmount))
    ); // Matches header structure with date or amount
};
  
export const extractTransactionTable = function (text: string) {
    const lines = text.split('\n');
    const result = [];
    let inTable = false;
    let headerLine = null;
    let consecutiveInvalidLines = 0;
    const MAX_INVALID_LINES = 3; // Allow a few invalid lines in a row
  
    // First pass: Look for header marker patterns like multiple asterisks that indicate the start of a table section
    const headerMarkerPatterns = [
      /^\*{10,}$/, // Line with just asterisks
      /^={10,}$/, // Line with just equal signs
      /^-{10,}$/, // Line with just dashes
    ];
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
  
      // Skip empty lines
      if (!line) continue;
  
      // Check if this is a header marker (like a row of asterisks)
      const isHeaderMarker = headerMarkerPatterns.some((pattern) =>
        pattern.test(line)
      );
  
      // If we found a header marker, check the next non-empty line as a potential header
      if (isHeaderMarker && i + 1 < lines.length) {
        // Find next non-empty line
        let nextNonEmptyIndex = i + 1;
        while (
          nextNonEmptyIndex < lines.length &&
          !lines[nextNonEmptyIndex].trim()
        ) {
          nextNonEmptyIndex++;
        }
  
        if (nextNonEmptyIndex < lines.length) {
          const potentialHeader = lines[nextNonEmptyIndex].trim();
          if (isHeaderLine(potentialHeader)) {
            // We found a header line right after a header marker - very likely the start of the transaction table
            headerLine = potentialHeader;
            result.push(headerLine);
            inTable = true;
            i = nextNonEmptyIndex; // Skip ahead to this position
            continue;
          }
        }
      }
  
      // Regular header detection if not already in a table
      if (!inTable && isHeaderLine(line)) {
        headerLine = line;
        result.push(line);
        inTable = true;
        consecutiveInvalidLines = 0;
        continue;
      }
  
      // If inside table, collect valid transaction rows
      if (inTable) {
        // Stop at known footers or unrelated sections
        if (isFooterLine(line)) {
          break;
        }
  
        // Validate if this line looks like a transaction row
        if (isValidTransactionRow(line, headerLine)) {
          result.push(line);
          consecutiveInvalidLines = 0;
        } else {
          // Check if this line might be a continuation of the previous line
          // (Sometimes transaction descriptions span multiple lines)
          const prevLine = result.length > 1 ? result[result.length - 1] : null;
          const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : null;
  
          // If this is all asterisks/special characters and the next line is a valid transaction, this is likely just a separator
          if (
            /^[*=\-,]+$/.test(line) &&
            nextLine &&
            isValidTransactionRow(nextLine, headerLine)
          ) {
            continue;
          }
  
          if (
            prevLine &&
            !isHeaderLine(prevLine) &&
            (line.length < 50 || !line.includes(',')) &&
            nextLine &&
            isValidTransactionRow(nextLine, headerLine)
          ) {
            // This looks like description continuation, skip it
            continue;
          }
  
          consecutiveInvalidLines++;
          if (consecutiveInvalidLines > MAX_INVALID_LINES) {
            // Too many invalid lines in a row, we're probably out of the table section
            break;
          }
        }
      }
    }
  
    // If we found no transaction rows, try with less strict header detection
    if (result.length <= 1) {
      // Look for sections with consecutive lines that look like transactions
      let bestSection: string[] = [];
      let currentSection = [];
      let consecutiveTransactions = 0;
  
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
  
        if (isValidTransactionRow(line)) {
          currentSection.push(line);
          consecutiveTransactions++;
        } else {
          // If we had a good run of transaction-like rows, save this section
          if (
            consecutiveTransactions >= 5 &&
            currentSection.length > bestSection.length
          ) {
            bestSection = [...currentSection];
          }
          currentSection = [];
          consecutiveTransactions = 0;
        }
      }
  
      // Check if our last section is worth keeping
      if (
        consecutiveTransactions >= 5 &&
        currentSection.length > bestSection.length
      ) {
        bestSection = [...currentSection];
      }
  
      // If we found a good section, use it
      if (bestSection.length > 0) {
        return bestSection.join('\n');
      }
    }
  
    return result.join('\n');
  };
