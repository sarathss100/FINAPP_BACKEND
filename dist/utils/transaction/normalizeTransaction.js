"use strict";
/* eslint-disable no-prototype-builtins */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTransactionObject = void 0;
/**
 * Standardizes various date formats into a Date object
 * @param dateValue - The date value to standardize
 * @returns A standardized Date object or null if conversion fails
 */
const standardizeDate = (dateValue) => {
    if (!dateValue)
        return null;
    // If it's already a Date object, return it
    if (dateValue instanceof Date) {
        if (isNaN(dateValue.getTime()))
            return null;
        return dateValue;
    }
    // Convert to string if it's not already
    const dateStr = String(dateValue).trim();
    if (dateStr === '')
        return null;
    try {
        // Try to identify common date formats and convert them
        // Format: DD/MM/YYYY or MM/DD/YYYY or YYYY/MM/DD
        if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                // Detect format based on values
                let year, month, day;
                // If first part is a 4-digit number, assume YYYY/MM/DD
                if (parts[0].length === 4 && !isNaN(parseInt(parts[0]))) {
                    year = parseInt(parts[0]);
                    month = parseInt(parts[1]) - 1; // JavaScript months are 0-indexed
                    day = parseInt(parts[2]);
                }
                // If third part is a 4-digit number, assume DD/MM/YYYY or MM/DD/YYYY
                else if (parts[2].length === 4 && !isNaN(parseInt(parts[2]))) {
                    year = parseInt(parts[2]);
                    // If first part is > 12, assume DD/MM/YYYY
                    if (parseInt(parts[0]) > 12) {
                        day = parseInt(parts[0]);
                        month = parseInt(parts[1]) - 1;
                    }
                    // Otherwise assume MM/DD/YYYY (US format)
                    else {
                        month = parseInt(parts[0]) - 1;
                        day = parseInt(parts[1]);
                    }
                }
                else {
                    // Default to DD/MM/YY
                    day = parseInt(parts[0]);
                    month = parseInt(parts[1]) - 1;
                    year = parseInt(parts[2]);
                    // Handle 2-digit years
                    if (year < 100) {
                        year = year + (year < 50 ? 2000 : 1900);
                    }
                }
                const date = new Date(year, month, day);
                if (!isNaN(date.getTime()))
                    return date;
            }
        }
        // Format: DD-MM-YYYY or MM-DD-YYYY or YYYY-MM-DD
        if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                // Detect format based on values
                let year, month, day;
                // If first part is a 4-digit number, assume YYYY-MM-DD (ISO format)
                if (parts[0].length === 4 && !isNaN(parseInt(parts[0]))) {
                    year = parseInt(parts[0]);
                    month = parseInt(parts[1]) - 1;
                    day = parseInt(parts[2]);
                }
                // If third part is a 4-digit number, assume DD-MM-YYYY or MM-DD-YYYY
                else if (parts[2].length === 4 && !isNaN(parseInt(parts[2]))) {
                    year = parseInt(parts[2]);
                    // If first part is > 12, assume DD-MM-YYYY
                    if (parseInt(parts[0]) > 12) {
                        day = parseInt(parts[0]);
                        month = parseInt(parts[1]) - 1;
                    }
                    // Otherwise assume MM-DD-YYYY (US format)
                    else {
                        month = parseInt(parts[0]) - 1;
                        day = parseInt(parts[1]);
                    }
                }
                else {
                    // Default to DD-MM-YY
                    day = parseInt(parts[0]);
                    month = parseInt(parts[1]) - 1;
                    year = parseInt(parts[2]);
                    // Handle 2-digit years
                    if (year < 100) {
                        year = year + (year < 50 ? 2000 : 1900);
                    }
                }
                const date = new Date(year, month, day);
                if (!isNaN(date.getTime()))
                    return date;
            }
        }
        // Format: DD MMM YYYY (e.g., 01 Jan 2023)
        const monthNamePattern = /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/;
        const monthNameMatch = dateStr.match(monthNamePattern);
        if (monthNameMatch) {
            const day = parseInt(monthNameMatch[1]);
            const monthStr = monthNameMatch[2].toLowerCase();
            const year = parseInt(monthNameMatch[3]);
            const months = {
                jan: 0,
                feb: 1,
                mar: 2,
                apr: 3,
                may: 4,
                jun: 5,
                jul: 6,
                aug: 7,
                sep: 8,
                oct: 9,
                nov: 10,
                dec: 11,
            };
            if (months[monthStr] !== undefined) {
                const date = new Date(year, months[monthStr], day);
                if (!isNaN(date.getTime()))
                    return date;
            }
        }
        // Format: MMM DD, YYYY (e.g., Jan 01, 2023)
        const monthDayPattern = /^([A-Za-z]{3})\s+(\d{1,2})(?:,)?\s+(\d{4})$/;
        const monthDayMatch = dateStr.match(monthDayPattern);
        if (monthDayMatch) {
            const monthStr = monthDayMatch[1].toLowerCase();
            const day = parseInt(monthDayMatch[2]);
            const year = parseInt(monthDayMatch[3]);
            const months = {
                jan: 0,
                feb: 1,
                mar: 2,
                apr: 3,
                may: 4,
                jun: 5,
                jul: 6,
                aug: 7,
                sep: 8,
                oct: 9,
                nov: 10,
                dec: 11,
            };
            if (months[monthStr] !== undefined) {
                const date = new Date(year, months[monthStr], day);
                if (!isNaN(date.getTime()))
                    return date;
            }
        }
        // Try native Date parsing as a fallback
        // Note: This can be unpredictable across browsers
        const date = new Date(dateStr);
        if (!isNaN(date.getTime()))
            return date;
        // If all parsing attempts fail, return null
        return null;
    }
    catch (error) {
        console.error('Error parsing date:', error);
        return null;
    }
};
/**
 * Normalizes transaction data into a standardized format
 * @param transactionData - The transaction data to normalize
 * @returns Normalized transaction object(s)
 */
const normalizeTransactionObject = (transactionData) => {
    // If we receive an array, handle each item separately
    if (Array.isArray(transactionData)) {
        return transactionData.map((item) => (0, exports.normalizeTransactionObject)(item));
    }
    // Handle single transaction object
    const transactionRow = transactionData;
    // Standardized field mapping
    const keywordMap = {
        date: [
            'date',
            'entry_date',
            'posting_date',
            'value_date',
            'tran_date',
            'txn date',
            'txn_date',
            'transaction_date',
        ],
        credit_amount: [
            'credit',
            'cr',
            'paid in',
            'credit_amt',
            'payment / credits and rebates',
            'amount paid',
            'payment',
            'credits',
            'rebates',
            'deposit',
        ],
        debit_amount: [
            'debit',
            'dr',
            'withdrawal',
            'debit_amt',
            'paid out',
            'amount due',
            'purchases and advances',
            'expenses',
            'withdrawals',
        ],
        description: [
            'description',
            'details_of_transaction',
            'particulars',
            'remarks',
            'narration',
            'details',
            'detail',
            'remarks1',
            'remarks2',
            'transaction_description',
            'narrative',
            'card type',
            'transfer',
        ],
        closing_balance: [
            'balance',
            'closing balance',
            'running balance',
            'available balance',
            'net balance',
            'opening balance',
            'previous balance',
        ],
        transaction_id: [
            'reference_no',
            'ref_no',
            'transaction_ref_no',
            'txn_id',
            'tran_id',
            'utr',
            'utr_no',
            'reference',
            'ref',
            'ref no./cheque no.',
            'cheque no',
        ],
    };
    const normalizedRecord = {
        date: null,
        description: 'Unknown transaction',
        transaction_id: '',
        credit_amount: 0,
        debit_amount: 0,
        closing_balance: 0,
        transaction_type: 'unknown',
        amount: 0
    };
    // Normalize keys based on keyword map
    for (const key in transactionRow) {
        if (!transactionRow.hasOwnProperty(key))
            continue;
        const cellValue = transactionRow[key];
        if (cellValue === undefined || cellValue === null)
            continue;
        const lowerKey = key.toLowerCase().trim();
        for (const [standardField, synonyms] of Object.entries(keywordMap)) {
            if (synonyms.some((synonym) => lowerKey.includes(synonym))) {
                if (standardField === 'date') {
                    // Standardize date to MongoDB-compatible format
                    normalizedRecord.date = standardizeDate(typeof cellValue === 'object' && cellValue !== null ? String(cellValue) : cellValue);
                }
                else if (['credit_amount', 'debit_amount', 'closing_balance'].includes(standardField)) {
                    // Clean and parse numeric values
                    const stringValue = String(cellValue);
                    // Skip empty strings for numeric fields
                    if (stringValue.trim() === '')
                        continue;
                    const cleanedValue = stringValue.replace(/[^\d.-]/g, '');
                    const numValue = parseFloat(cleanedValue);
                    if (!isNaN(numValue)) {
                        normalizedRecord[standardField] = numValue;
                    }
                }
                else if (standardField === 'description' || standardField === 'transaction_id') {
                    normalizedRecord[standardField] = String(cellValue);
                }
                break;
            }
        }
    }
    // Prioritize description field from specific fields
    if (!normalizedRecord.description ||
        normalizedRecord.description === 'Unknown transaction' ||
        normalizedRecord.description.match(/^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}$/)) {
        // Specifically look for transfer-related descriptions first
        for (const key in transactionRow) {
            const value = String(transactionRow[key] || '');
            if (value.toLowerCase().includes('transfer') ||
                value.toLowerCase().includes('credit') ||
                value.toLowerCase().includes('payment')) {
                if (value.length > 3 &&
                    !value.match(/^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}$/)) {
                    normalizedRecord.description = value.trim();
                    break;
                }
            }
        }
        // If still not found, check specific description-like named fields
        if (normalizedRecord.description === 'Unknown transaction' ||
            normalizedRecord.description.match(/^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}$/)) {
            const descriptionKeywords = [
                'description',
                'narration',
                'particulars',
                'details',
                'remarks',
                'narrative',
            ];
            for (const key in transactionRow) {
                const lowerKey = key.toLowerCase();
                if (descriptionKeywords.some((keyword) => lowerKey.includes(keyword))) {
                    const value = String(transactionRow[key] || '');
                    if (value.trim().length > 0 &&
                        !value.match(/^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}$/)) {
                        normalizedRecord.description = value.trim();
                        break;
                    }
                }
            }
        }
    }
    // Prefer Value Date over Txn Date if both are present
    if (normalizedRecord.date) {
        for (const key in transactionRow) {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes('value date') || lowerKey === 'value_date') {
                const valueDate = transactionRow[key];
                if (valueDate &&
                    typeof valueDate === 'string' &&
                    valueDate.trim().length > 0) {
                    normalizedRecord.date = standardizeDate(valueDate.trim());
                }
            }
        }
    }
    // Determine transaction type
    if (normalizedRecord.credit_amount > 0) {
        normalizedRecord.transaction_type = 'income';
        normalizedRecord.amount = normalizedRecord.credit_amount;
    }
    else if (normalizedRecord.debit_amount > 0) {
        normalizedRecord.transaction_type = 'expense';
        normalizedRecord.amount = normalizedRecord.debit_amount;
    }
    else {
        normalizedRecord.transaction_type = 'unknown';
        normalizedRecord.amount = 0;
    }
    return normalizedRecord;
};
exports.normalizeTransactionObject = normalizeTransactionObject;
