/**
 * DTO for Mutual Fund entity
 */
export interface IMutualFundDTO {
    scheme_code: string; // Required field
    scheme_name: string; // Required field
    net_asset_value: number; // Must be a number
    date: Date; // Must be a valid date
}
