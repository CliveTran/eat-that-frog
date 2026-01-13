import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { TrendingUp, CreditCard } from "lucide-react";
import { formatCurrency } from "./money-utils";
import type { MoneyProfile } from "./types";
import { cn } from "~/lib/utils";

interface DashboardCardProps {
  dailyAvailable: number;
  remainingBudget: number;
  percentRemaining: number;
  totalSpent: number;
  discretionaryTotal: number;
  profile: MoneyProfile;
}

const getProgressColor = (percent: number) => {
  if (percent > 50) return "bg-green-500";
  if (percent > 20) return "bg-yellow-500";
  return "bg-red-500";
};

export function DashboardCard({
  dailyAvailable,
  remainingBudget,
  percentRemaining,
  totalSpent,
  discretionaryTotal,
  profile,
}: DashboardCardProps) {
  return (
    <Card className="shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid md:grid-cols-2">
        {/* Left: The Number */}
        <div className="p-8 flex flex-col justify-center items-center text-center md:border-r border-border/50">
          <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
            Safe to Spend Today
            {dailyAvailable <= 0 && <Badge variant="destructive">Over Budget</Badge>}
            {dailyAvailable > 50 && <Badge className="bg-green-500 hover:bg-green-600">Rich Day!</Badge>}
          </span>
          <div className={cn("text-6xl font-black tracking-tighter mb-2", dailyAvailable <= 0 ? "text-red-500" : "text-primary")}>
            {formatCurrency(dailyAvailable, profile.currency)}
          </div>
          <p className="text-sm text-balance text-muted-foreground max-w-xs mx-auto">
            {dailyAvailable > 0 ? (
              <>
                You can spend this amount <strong>daily</strong> for the rest of the
                month and end perfectly on budget.
              </>
            ) : dailyAvailable === 0 ? (
              "You've reached your spending limit for today. Try to avoid further expenses."
            ) : (
              "You've exceeded your daily safety limit. Reduce spending to balance the month."
            )}
          </p>
        </div>
        
        {/* Right: The Breakdown */}
        <div className="p-8 flex flex-col justify-center space-y-6">
           <div className="space-y-2">
             <div className="flex justify-between text-sm">
               <span className="text-muted-foreground">Discretionary Remaining</span>
               <span className="font-semibold">{formatCurrency(remainingBudget, profile.currency)}</span>
             </div>
             <Progress 
                value={percentRemaining} 
                className="h-2" 
                indicatorColor={getProgressColor(percentRemaining)}
             />
             <div className="flex justify-between text-xs text-muted-foreground">
               <span>{formatCurrency(totalSpent, profile.currency)} spent</span>
               <span>{formatCurrency(discretionaryTotal, profile.currency)} total budget</span>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 space-y-1">
                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    Saved
                 </div>
                 <div className="text-xl font-bold">{formatCurrency(profile.savingsGoal, profile.currency)}</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 space-y-1">
                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CreditCard className="w-3 h-3 text-orange-500" />
                    Fixed
                 </div>
                 <div className="text-xl font-bold">{formatCurrency(profile.fixedExpenses, profile.currency)}</div>
              </div>
           </div>
        </div>
      </div>
    </Card>
  );
}
