import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { PlayCircle, RotateCcw } from "lucide-react";
import { cn } from "~/lib/utils";
import { 
  formatCurrency, 
  formatCompactCurrency, 
  getHistoryStatus, 
  MONTH_NAMES, 
  FULL_MONTH_NAMES, 
  CURRENT_MONTH, 
  CURRENT_YEAR 
} from "./money-utils";
import type { MoneyProfile, MonthlyRecord, Transaction } from "./types";
import { MonthDetailsDialog } from "./month-details-dialog";

interface YearTrackerProps {
  history: MonthlyRecord[];
  profile: MoneyProfile;
  currentMonthSaved: number;
  totalSpent: number;
  currentTransactions: Transaction[];
  onGenerateMockData: () => void;
  onClearHistory: () => void;
}

export function YearTracker({
  history,
  profile,
  currentMonthSaved,
  totalSpent,
  currentTransactions,
  onGenerateMockData,
  onClearHistory,
}: YearTrackerProps) {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null);

  const realTotalSaved = history
    .filter((h) => h.year === CURRENT_YEAR)
    .reduce((acc, curr) => acc + curr.saved, 0) + currentMonthSaved;

  const handleMonthClick = (index: number, hasData: boolean) => {
    if (hasData) {
      setSelectedMonthIndex(index);
    }
  };

  // Prepare data for the dialog if a month is selected
  let dialogData = {
    income: 0,
    fixed: 0,
    saved: 0,
    spent: 0,
    savingsGoal: 0,
    transactions: [] as Transaction[],
    status: 'safe' as 'safe' | 'warning' | 'danger',
    title: '',
  };

  if (selectedMonthIndex !== null) {
    const record = history.find(h => h.month === selectedMonthIndex && h.year === CURRENT_YEAR);
    const isCurrent = selectedMonthIndex === CURRENT_MONTH;

    dialogData.title = `${FULL_MONTH_NAMES[selectedMonthIndex]} ${CURRENT_YEAR}`;
    
    if (record) {
      dialogData.income = record.income;
      dialogData.saved = record.saved;
      dialogData.savingsGoal = record.goal;
      dialogData.spent = record.spent; // Note: In mock data, this tracks "spent". 
      // Derived fixed? In the main app logic: saved = income - fixed - spent.
      // So fixed = income - saved - spent.
      dialogData.fixed = record.income - record.saved - record.spent;
      dialogData.transactions = record.transactions || [];
    } else if (isCurrent) {
       dialogData.income = profile.monthlyIncome;
       dialogData.fixed = profile.fixedExpenses;
       dialogData.savingsGoal = profile.savingsGoal;
       dialogData.spent = totalSpent;
       dialogData.saved = currentMonthSaved;
       dialogData.transactions = currentTransactions;
    }
    
    const goalStatus = getHistoryStatus(dialogData.saved, dialogData.savingsGoal);
    // map tailwind class back to status enum
    if (goalStatus.includes("green")) dialogData.status = 'safe';
    else if (goalStatus.includes("yellow")) dialogData.status = 'warning';
    else dialogData.status = 'danger';
  }

  return (
    <>
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl flex flex-wrap items-center gap-2">
              Year Tracker
              {(history.length === 0 || (history.length === 1 && history[0].month !== CURRENT_MONTH)) ? (
                <Button 

                  variant="default" 
                  size="sm" 
                  className="h-7 text-xs ml-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  onClick={onGenerateMockData}
                >
                   <PlayCircle className="w-3 h-3 mr-1" />
                   Generate Demo Data
                </Button>
              ) : (
                <Button 
                   variant="ghost" 
                   size="sm" 
                   className="h-7 text-xs ml-2 text-muted-foreground hover:text-destructive"
                   onClick={onClearHistory}
                >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Clear Demo Data
                </Button>
              )}
            </CardTitle>
            <div className="text-left sm:text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Saved {CURRENT_YEAR}</p>
              <p className={cn("text-2xl font-bold", realTotalSaved >= 0 ? "text-green-600" : "text-red-500")}>
                {formatCurrency(realTotalSaved, profile.currency)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {MONTH_NAMES.map((name, index) => {
              const record = history.find(h => h.month === index && h.year === CURRENT_YEAR);
              const isCurrent = index === CURRENT_MONTH;
              
              let statusColor = "bg-slate-100 dark:bg-slate-800";
              let savedAmount = 0;
              let goal = 0;
              
              if (record) {
                savedAmount = record.saved;
                goal = record.goal;
                statusColor = getHistoryStatus(savedAmount, goal);
              } else if (isCurrent) {
                 savedAmount = currentMonthSaved; 
                 goal = profile.savingsGoal;
                 statusColor = getHistoryStatus(savedAmount, goal);
              }

              const hasData = !!record || isCurrent;

              return (
                <div 
                  key={name} 
                  className={cn(
                    "flex flex-col items-center gap-2 p-2 rounded-lg transition-all border border-transparent hover:bg-muted/50Select", 
                    hasData && "cursor-pointer",
                    isCurrent && "bg-secondary/30 border-primary/20 shadow-sm hover:bg-secondary/40"
                  )}
                  onClick={() => handleMonthClick(index, hasData)}
                >
                  {/* Bar Chart Visualization */}
                  <div className="relative w-full h-24 bg-white dark:bg-slate-950 rounded-md overflow-hidden flex items-end border border-slate-200 dark:border-slate-700">
                    {hasData ? (
                      <div 
                        className={cn("w-full transition-all duration-500", statusColor, isCurrent && "animate-pulse")}
                        style={{ height: `${Math.min(100, Math.max(5, (savedAmount / goal) * 100))}%` }}
                      ></div>
                    ) : null}
                  </div>
                  
                  <div className="text-center">
                    <span className={cn("text-xs font-bold uppercase", isCurrent ? "text-foreground" : "text-muted-foreground")}>{name}</span>
                    <div className="text-[10px] text-muted-foreground truncate w-full">
                       {hasData ? formatCompactCurrency(savedAmount, profile.currency) : "-"}
                    </div>
                    {isCurrent && (
                      <div className={cn("text-[10px] font-bold uppercase mt-1 animate-pulse", statusColor.replace("bg-", "text-"))}>Active</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {selectedMonthIndex !== null && (
        <MonthDetailsDialog 
          isOpen={true}
          onClose={() => setSelectedMonthIndex(null)}
          title={dialogData.title}
          currency={profile.currency}
          income={dialogData.income}
          fixed={dialogData.fixed}
          saved={dialogData.saved}
          spent={dialogData.spent}
          savingsGoal={dialogData.savingsGoal}
          transactions={dialogData.transactions}
          status={dialogData.status}
        />
      )}
    </>
  );
}
