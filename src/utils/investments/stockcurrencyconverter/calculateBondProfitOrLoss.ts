import { IBondDTO } from "dtos/investments/investmentDTO";


/**
 * Calculates the current value and total profit or loss for a bond investment.
 *
 * This function assumes:
 * - The bond pays simple interest annually.
 * - The market price per bond is equal to the face value (can be extended in future versions).
 * - Interest accrues linearly based on the number of days held.
 *
 * @param {IBond} bondData - Bond investment data containing face value, coupon rate, initial amount, and purchase date.
 * @returns {{
 *   currentValue: number,
 *   totalProfitOrLoss: number
 * }} An object containing the calculated current value and profit/loss.
 *
 * @throws {Error} If required values like `faceValue` or `initialAmount` are invalid.
 * @throws {Error} If the `purchaseDate` is not a valid date.
 */
const calculateBondProfitOrLoss = function(bondData: IBondDTO): { 
    currentValue: number; 
    totalProfitOrLoss: number 
} {
    // Destructure bond data with defaults
    const {
        faceValue = 100,
        couponRate = 0,
        initialAmount = 0,
        purchaseDate,
    } = bondData;

    // Validate essential inputs
    if (faceValue <= 0 || initialAmount <= 0) {
        throw new Error(`Face value and initial amount must be greater than zero.`);
    }

    // Calculate how many bonds were purchased
    const numberOfBonds = initialAmount / faceValue;

    // Annual interest payment per bond
    const couponPaymentPerBond = (faceValue * couponRate) / 100;

    // Get today's date and parse the purchase date
    const today = new Date();
    const purchase = new Date(purchaseDate);

    // Ensure purchase date is valid
    if (isNaN(purchase.getTime())) {
        throw new Error(`Invalid purchase date provided`);
    }

    // Calculate time since purchase in years
    const totalDaysHeld = (today.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24);
    const yearsHeld = totalDaysHeld / 365;

    // Calculate accrued interest so far
    const accuredInterestPerBond = couponPaymentPerBond * yearsHeld;
    const totalAccuredInterest = accuredInterestPerBond * numberOfBonds;

    // Assume current market price equals face value (can be replaced with live API)
    const currentMarketPricePerBond = faceValue;

    // Total current value includes principal + accrued interest
    const currentValue = numberOfBonds * currentMarketPricePerBond + totalAccuredInterest;

    // Profit or loss is difference between current value and initial investment
    const totalProfitOrLoss = currentValue - initialAmount;

    return {
        currentValue, 
        totalProfitOrLoss
    };
};

export default calculateBondProfitOrLoss;