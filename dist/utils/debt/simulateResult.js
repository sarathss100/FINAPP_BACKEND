"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareStrategies = compareStrategies;
function cloneDebt(debt) {
    return Object.assign({}, debt);
}
function calculateMonthlyInterest(debt) {
    if (debt.currentBalance <= 0)
        return 0;
    if (debt.interestType === 'Flat') {
        // For flat interest, monthly interest is fixed regardless of balance
        const totalInterest = debt.principal * (debt.interestRate / 100) * (debt.tenureMonths / 12);
        return totalInterest / debt.tenureMonths;
    }
    else {
        // For diminishing balance, interest is calculated on current balance
        const monthlyRate = (debt.interestRate / 100) / 12;
        return debt.currentBalance * monthlyRate;
    }
}
function applyPaymentToDebt(debt, paymentAmount) {
    if (debt.currentBalance <= 0)
        return 0;
    const interestDue = calculateMonthlyInterest(debt);
    const principalPayment = Math.max(0, paymentAmount - interestDue);
    const actualPrincipalPayment = Math.min(principalPayment, debt.currentBalance);
    debt.currentBalance -= actualPrincipalPayment;
    debt.currentBalance = Math.max(0, debt.currentBalance);
    return interestDue;
}
function simulateDebtPayoff(debts, extraPayment, strategy) {
    const workingDebts = debts.map(cloneDebt);
    let month = 0;
    let totalInterest = 0;
    const totalMinPayments = debts.reduce((sum, d) => sum + d.monthlyPayment, 0);
    while (workingDebts.some(d => d.currentBalance > 0)) {
        month++;
        // Step 1: Apply minimum payments to all debts and calculate total interest
        for (const debt of workingDebts) {
            if (debt.currentBalance > 0) {
                const minPayment = Math.min(debt.monthlyPayment, debt.currentBalance + calculateMonthlyInterest(debt));
                const interestPaid = applyPaymentToDebt(debt, minPayment);
                totalInterest += interestPaid;
            }
        }
        // Step 2: Apply extra payment to priority debt based on strategy
        if (extraPayment > 0) {
            let priorityDebt;
            if (strategy === 'avalanche') {
                // Find debt with highest interest rate that still has balance
                priorityDebt = workingDebts
                    .filter(d => d.currentBalance > 0)
                    .sort((a, b) => b.interestRate - a.interestRate)[0];
            }
            else {
                // Find debt with smallest balance that still has balance
                priorityDebt = workingDebts
                    .filter(d => d.currentBalance > 0)
                    .sort((a, b) => a.currentBalance - b.currentBalance)[0];
            }
            if (priorityDebt) {
                const interestPaid = applyPaymentToDebt(priorityDebt, extraPayment);
                totalInterest += interestPaid;
            }
        }
        // Step 3: Apply any freed-up payments from paid-off debts to priority debt
        const paidOffDebts = workingDebts.filter(d => d.currentBalance === 0);
        if (paidOffDebts.length > 0) {
            const freedUpPayment = paidOffDebts.reduce((sum, d) => sum + d.monthlyPayment, 0);
            if (freedUpPayment > 0) {
                let priorityDebt;
                if (strategy === 'avalanche') {
                    priorityDebt = workingDebts
                        .filter(d => d.currentBalance > 0)
                        .sort((a, b) => b.interestRate - a.interestRate)[0];
                }
                else {
                    priorityDebt = workingDebts
                        .filter(d => d.currentBalance > 0)
                        .sort((a, b) => a.currentBalance - b.currentBalance)[0];
                }
                if (priorityDebt) {
                    const interestPaid = applyPaymentToDebt(priorityDebt, freedUpPayment);
                    totalInterest += interestPaid;
                }
            }
        }
        // Safety check to prevent infinite loops
        if (month > 1000) {
            console.warn('Simulation exceeded 1000 months, breaking to prevent infinite loop');
            break;
        }
    }
    return {
        totalMonths: month,
        totalInterestPaid: Number(totalInterest.toFixed(2)),
        totalMonthlyPayment: totalMinPayments + extraPayment
    };
}
function simulateAvalanche(debts_1) {
    return __awaiter(this, arguments, void 0, function* (debts, extraPayment = 0) {
        return simulateDebtPayoff(debts, extraPayment, 'avalanche');
    });
}
function simulateSnowball(debts_1) {
    return __awaiter(this, arguments, void 0, function* (debts, extraPayment = 0) {
        return simulateDebtPayoff(debts, extraPayment, 'snowball');
    });
}
function compareStrategies(dbDebts_1) {
    return __awaiter(this, arguments, void 0, function* (dbDebts, extraPayment = 0) {
        const snowballResult = yield simulateSnowball(dbDebts, extraPayment);
        const avalancheResult = yield simulateAvalanche(dbDebts, extraPayment);
        return {
            snowball: snowballResult,
            avalanche: avalancheResult
        };
    });
}
