
export const SuccessMessages = {
    // Authentication Success Messages
    SIGNUP_SUCCESS: 'User account created successfully.',
    SIGNIN_SUCCESS: 'Sign-in completed successfully.',
    SIGNOUT_SUCCESS: 'Signed out successfully.',
    TOKEN_VERIFIED: 'Access token verified successfully.',
    PHONE_NUMBER_VERIFIED: 'Phone number verified successfully.',
    PASSWORD_RESET_SUCCESS: 'Password updated successfully.',

    // General Success Messages
    OPERATION_SUCCESS: 'Operation completed successfully.',

    // User Success Messages
    USER_PROFILE_FETCHED: 'User profile details retrieved successfully.',
    USER_PROFILE_PICTURE_URL_FETCHED: 'User profile picture URL retrieved successfully.',
    USER_STATUS_UPDATED: 'User status updated successfully.',
    USER_PROFILE_PICTURE_UPLOADED: 'Profile picture uploaded successfully.',
    USER_GOAL_UPDATED: 'User goal updated successfully.',
    SUCCESSFULLY_TOGGLED_2FA: 'Two-Factor Authentication (2FA) status updated successfully.',
    USER_ACCOUNT_DELETED: 'User account deleted successfully.',

    // Goal Success Messages
    GOAL_CREATED: 'User goal created successfully.',
    GOAL_REMOVED: 'Goal removed successfully.',
    GOALS_RETRIEVED: 'User goals retrieved successfully.',
    GOALS_LONGEST_TIME_REMAINING: 'Goal with the longest time remaining retrieved successfully.',
    GOALS_ANALYSIS_RESULT: 'Goal analysis result retrieved successfully.',
    GOAL_BY_CATEGORY: 'Goals categorized successfully.',
    GOAL_DAILY_CONTRIBUTION: 'Daily contribution retrieved successfully.',
    GOAL_MONTHLY_CONTRIBUTION: 'Monthly contribution retrieved successfully.',
    GOAL_TRANSACTION_UPDATED: 'Goal Transaction Updated Successfully.',

    // Transaction Success Messages
    TRANSACTION_CREATED: 'Transaction created successfully.',
    TRANSACTION_RETRIEVED: 'Transaction retrieved successfully.',
    EXTRACTED_DATA: 'Transaction data extracted successfully',

    // Admin Success Messages
    FAQ_ADDED: 'FAQ added successfully.',
    FAQ_FETCHED_SUCCESSFULLY: 'FAQs retrieved successfully.',

    // Accounts Success Messages
    ACCOUNT_ADDED: 'Account Added successfully',
    USER_ACCOUNT_UPDATED: 'User account updated successfully.',
    ACCOUNT_REMOVED: 'Account removed successfully.', 
    ACCOUNT_TOTAL_BALANCE: 'Account total balance retrieved successfully',
    ACCOUNT_TOTAL_BANK_BALANCE: 'Account total balance balance retrieved successfully',
    ACCOUNT_TOTAL_DEBT: 'Account total debt retrieved successfully',
    ACCOUNT_TOTAL_INVESTMENT: 'Account total investment retrieved successfully',

    // MutualFund Success Messages
    NAV_SYNCHED: 'NAV Synched Successfully',
    MUTUAL_FUND_SEARCH_SUCCESS: 'Mutual Funds found successfully.',

    // Insurance Success Messages
    INSURANCE_DELETED_SUCCESSFULLY: 'Insurance deleted successfully',
    INSURANCE_COVERAGE_RETRIEVED: 'Insurance Coverage Retrieved Successfully',
    INSURANCES_RETRIEVED: 'Insurances Retrieved Successfully',
    NEXT_PAYMENT_DATE_RETRIEVED: 'Closest Next Payment Date Retrieved Successfully',
    PAYMENT_STATUS_UPDATED: 'Insurance Payment Status Updated Successfully',
} as const;
