import type { Currency, MoneyProfile, MonthlyRecord } from "./types";

export const CURRENT_MONTH_DAYS = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
export const TODAY = new Date().getDate();
export const CURRENT_MONTH = new Date().getMonth();
export const CURRENT_YEAR = new Date().getFullYear();
export const DAYS_REMAINING = CURRENT_MONTH_DAYS - TODAY + 1;

export const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const FULL_MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const formatCurrency = (amount: number, currency: Currency) => {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'vi-VN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'USD' ? 0 : 0, 
  }).format(amount);
};

export const formatCompactCurrency = (amount: number, currency: Currency) => {
  const formatter = Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1
  });
  
  // Intl 'compact' uses K, M, B by default for en-US. User requested lowercase.
  return formatter.format(amount).toLowerCase();
};

export const formatWithDots = (value: string) => {
  if (!value) return "";
  const cleanVal = value.replace(/\D/g, "");
  return cleanVal.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const getHistoryStatus = (saved: number, goal: number) => {
  if (saved >= goal) return "bg-green-500";
  if (saved >= goal * 0.5) return "bg-yellow-500";
  return "bg-red-500";
};

export const getProgressColor = (percent: number) => {
  if (percent >= 50) return "bg-green-500";
  if (percent >= 20) return "bg-yellow-500";
  return "bg-red-500";
};

export const generateMockHistory = (profile: MoneyProfile): MonthlyRecord[] => {
  // Generate data for the whole year (0-11)
  return Array.from({ length: 12 }).map((_, i) => {
    // Skip CURRENT_MONTH so the live view works
    if (i === CURRENT_MONTH) return null;

    const isVND = profile.currency === 'VND';
    const defaultIncome = isVND ? 20000000 : 5000;
    const defaultFixed = isVND ? 8000000 : 2000;
    const defaultGoal = isVND ? 5000000 : 1000;

    const income = profile.monthlyIncome > 0 ? profile.monthlyIncome : defaultIncome;
    const fixed = profile.fixedExpenses > 0 ? profile.fixedExpenses : defaultFixed;
    const goal = profile.savingsGoal > 0 ? profile.savingsGoal : defaultGoal;
    
    // Discretionary = Income - Fixed - Goal
    const discretionary = income - fixed - goal;
    
    // Variance: Generate Green, Yellow, and Red months
    // Random status factor:
    // 0.0 - 0.4: Green (Spent < Discretionary)
    // 0.4 - 0.7: Yellow (Spent nearing Discretionary, encroaching on Goal)
    // 0.7 - 1.0: Red (Spent > Discretionary, dipping into Fixed or just negative savings)
    
    const rand = Math.random();
    let spendFactor = 0;
    
    if (rand < 0.4) {
        // Green: Spend 20-80% of discretionary
        spendFactor = 0.2 + (Math.random() * 0.6);
    } else if (rand < 0.7) {
        // Yellow: Spend 80-110% of discretionary (eating into savings)
        spendFactor = 0.8 + (Math.random() * 0.3);
    } else {
        // Red: Spend 120-200% of discretionary (eating deep into savings/fixed)
        spendFactor = 1.2 + (Math.random() * 0.8);
    }

    const playSpent = discretionary * spendFactor; 
    
    // Saved = Income - Fixed - PlaySpent
    const saved = income - fixed - playSpent;

    return {
      month: i,
      year: CURRENT_YEAR,
      income: income,
      saved: Math.floor(saved),
      goal: goal,
      spent: Math.floor(playSpent),
      transactions: [
        { 
            id: `mock-${i}-1`, 
            amount: Math.floor(playSpent * 0.4), 
            description: "Big Purchase", 
            date: new Date(CURRENT_YEAR, i, 5).toISOString(), 
            type: 'expense' 
        },
        { 
            id: `mock-${i}-2`, 
            amount: Math.floor(playSpent * 0.1), 
            description: "Dining Out", 
            date: new Date(CURRENT_YEAR, i, 12).toISOString(), 
            type: 'expense' 
        },
        { 
            id: `mock-${i}-3`, 
            amount: Math.floor(playSpent * 0.2), 
            description: "Shopping", 
            date: new Date(CURRENT_YEAR, i, 20).toISOString(), 
            type: 'expense' 
        }
      ]
    };
  }).filter((record): record is MonthlyRecord => record !== null);
};
