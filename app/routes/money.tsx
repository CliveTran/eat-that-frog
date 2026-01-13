import { useState, useEffect } from "react";
import type { Route } from "./+types/money";
import { Button } from "~/components/ui/button";
import { Wallet, Settings } from "lucide-react";

import { SetupWizard } from "~/components/money/setup-wizard";
import { DashboardCard } from "~/components/money/dashboard-card";
import { YearTracker } from "~/components/money/year-tracker";
import { QuickAddForm } from "~/components/money/quick-add-form";
import { RecentTransactions } from "~/components/money/recent-transactions";
import type { MoneyProfile, MonthlyRecord, Transaction } from "~/components/money/types";
import { 
  CURRENT_MONTH_DAYS, 
  TODAY, 
  CURRENT_MONTH, 
  CURRENT_YEAR, 
  DAYS_REMAINING, 
  FULL_MONTH_NAMES,
  generateMockHistory
} from "~/components/money/money-utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Money - One Number Method" },
    { name: "description", content: "Simplify your finances to a single daily number." },
  ];
}

export default function Money() {
  // --- State ---
  const [profile, setProfile] = useState<MoneyProfile>({
    monthlyIncome: 0,
    fixedExpenses: 0,
    savingsGoal: 0,
    isSetup: false,
    currency: 'USD',
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [history, setHistory] = useState<MonthlyRecord[]>([]);
  const [showSetup, setShowSetup] = useState(false);

  // --- Persistence ---
  useEffect(() => {
    const savedProfile = localStorage.getItem("frog_money_profile");
    const savedHistory = localStorage.getItem("frog_money_history");
    const savedTransactions = localStorage.getItem("frog_money_transactions");
    
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }

    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile) as MoneyProfile;
        // Migration: Ensure currency and lastUpdatedMonth exist
        if (!parsed.currency) parsed.currency = 'USD';
        if (parsed.lastUpdatedMonth === undefined) parsed.lastUpdatedMonth = CURRENT_MONTH;
        setProfile(parsed);
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    }

    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (e) {
        console.error("Failed to load transactions", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("frog_money_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("frog_money_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("frog_money_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // --- Logic: Month Transition ---
  useEffect(() => {
    if (!profile.isSetup) return;

    if (profile.lastUpdatedMonth !== undefined && profile.lastUpdatedMonth !== CURRENT_MONTH) {
      // Month has changed! Archive current data (transactions) into history
      
      // Calculate final stats for the previous month
      // We assume 'transactions' belong to the 'previous active month'.
      
      const prevMonth = profile.lastUpdatedMonth;
      
      // Check if we already have a record for this prevMonth (avoid duplicates)
      const existingRecord = history.find(h => h.month === prevMonth && h.year === CURRENT_YEAR); // Simplified year check
      
      if (!existingRecord) {
        const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
        const saved = profile.monthlyIncome - profile.fixedExpenses - spent;
        
        const newRecord: MonthlyRecord = {
          month: prevMonth,
          year: CURRENT_YEAR,
          income: profile.monthlyIncome,
          saved: saved,
          goal: profile.savingsGoal,
          spent: spent,
          transactions: [...transactions]
        };
        
        setHistory(prev => [...prev, newRecord]);
      }
      
      // Reset for new month
      setTransactions([]);
      setProfile(prev => ({ ...prev, lastUpdatedMonth: CURRENT_MONTH }));
    }
  }, [profile.lastUpdatedMonth, profile.isSetup, CURRENT_MONTH]); 

  // --- Computations ---
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const discretionaryTotal = profile.monthlyIncome - profile.fixedExpenses - profile.savingsGoal;
  
  const currentMonthSaved = profile.monthlyIncome - profile.fixedExpenses - totalSpent; 

  const remainingBudget = discretionaryTotal - totalSpent;
  const dailyAvailable = DAYS_REMAINING > 0 ? (remainingBudget / DAYS_REMAINING) : 0;
  
  const percentRemaining = discretionaryTotal > 0 
    ? (remainingBudget / discretionaryTotal) * 100 
    : 0;

  // --- Handlers ---
  const handleSaveProfile = (newProfile: MoneyProfile) => {
    setProfile(newProfile);
    setShowSetup(false);
  };

  const handleAddTransaction = (amount: number, description: string) => {
    const newTx: Transaction = {
      id: crypto.randomUUID(),
      amount,
      description: description || "Expense",
      date: new Date().toISOString(),
      type: 'expense'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleUpdateTransaction = (updatedTx: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTx.id ? updatedTx : t));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleGenerateMockData = () => {
    // Generate history
    const mockHistory = generateMockHistory(profile);
    setHistory(mockHistory);
    // Add some random transactions to current month
    const isVND = profile.currency === 'VND'; 
    const multiplier = isVND ? 23000 : 1;
    
    const mockCurrentTxs: Transaction[] = Array.from({ length: 5 }).map((_, i) => ({
      id: crypto.randomUUID(),
      amount: (Math.floor(Math.random() * 50) + 10) * multiplier,
      description: `Mock Expense ${i + 1}`,
      date: new Date().toISOString(),
      type: 'expense'
    }));
    setTransactions(mockCurrentTxs);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all history? This cannot be undone.")) {
      setHistory([]);
      setTransactions([]);
    }
  };

  // --- Render ---
  if (showSetup || !profile.isSetup) {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <SetupWizard 
          initialData={profile} 
          onSave={handleSaveProfile} 
          onCancel={profile.isSetup ? () => setShowSetup(false) : undefined}
        />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header / Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Wallet className="h-8 w-8 text-primary" />
            Money
          </h1>
          <p className="text-muted-foreground">
            <span className="font-semibold text-primary/80">{FULL_MONTH_NAMES[CURRENT_MONTH]} {CURRENT_YEAR}</span> • Day {TODAY} of {CURRENT_MONTH_DAYS} • {DAYS_REMAINING} days remaining
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowSetup(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Adjust Budget
        </Button>
      </div>

      {/* The ONE NUMBER Card */}
      <DashboardCard 
        dailyAvailable={dailyAvailable}
        remainingBudget={remainingBudget}
        percentRemaining={percentRemaining}
        totalSpent={totalSpent}
        discretionaryTotal={discretionaryTotal}
        profile={profile}
      />

      {/* Year Tracker */}
      <YearTracker 
        history={history}
        profile={profile}
        currentMonthSaved={currentMonthSaved}
        totalSpent={totalSpent}
        currentTransactions={transactions}
        onGenerateMockData={handleGenerateMockData}
        onClearHistory={handleClearHistory}
      />

      {/* Quick Add & History */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Quick Add Form */}
        <div className="md:col-span-1">
          <QuickAddForm 
            currency={profile.currency} 
            onAdd={handleAddTransaction} 
          />
        </div>

        {/* Recent Transactions */}
        <div className="md:col-span-2">
          <RecentTransactions 
            transactions={transactions} 
            currency={profile.currency}
            onUpdate={handleUpdateTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>
    </div>
  );
}
