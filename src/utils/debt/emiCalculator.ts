interface UserInput {
    initialAmount: number;
    tenureMonths: number;
    interestRate: number;
    interestType: string;
    targetMonth: number;
}

interface IEmiBreakdown {
    emi: number;
    principal: number;
    interest: number;
}

const calculateLoanBreakdown = async function ({
    initialAmount,
    tenureMonths,
    interestRate,
    interestType,
    targetMonth
}: UserInput): Promise<IEmiBreakdown> {
    try {
        let emi = 0;
        let interest = 0;
        let principal = 0;

        if (interestType === 'Flat') {
            // Flat Interest Calculation
            const totalInterest = initialAmount * (interestRate / 100) * (tenureMonths / 12);
            emi = (initialAmount + totalInterest) / tenureMonths;
            interest = totalInterest / tenureMonths;
            principal = emi - interest;

        } else if (interestType === 'Diminishing') {
            if (targetMonth < 1 || targetMonth > tenureMonths) {
                throw new Error(`Target month must be between 1 and ${tenureMonths}`);
            }
            // Diminishing Balance Calculation (EMI formula)
            const monthlyRate = (interestRate / 100) / 12;
            let balance = initialAmount;

            const emi = (initialAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
            
            let currentMonth = 1;

            while (currentMonth <= targetMonth) {
                const interest = balance * monthlyRate;
                const principal = emi - interest;
                balance -= principal;
                currentMonth++;

                if (currentMonth > targetMonth) {
                    return {
                        emi: Number(emi.toFixed(2)),
                        principal: Number(principal.toFixed(2)),
                        interest: Number(interest.toFixed(2))
                    }
                }
            }
            throw new Error(`Could not calculate breakdown`);
        } else {
            throw new Error("Invalid interest type. Use 'Flat' or 'Diminishing'");
        }

        return {
            emi: Number(emi.toFixed(2)),
            principal: Number(principal.toFixed(2)),
            interest: Number(interest.toFixed(2)),
        };
    } catch (error) {
        throw new Error((error as Error).message || `Something went wrong while calculating Emi`);
    }
};

export default calculateLoanBreakdown;

// Calculate principal & interest for a specific month in 
