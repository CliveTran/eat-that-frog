import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { PieChart, PiggyBank, TrendingUp, TrendingDown } from "lucide-react";
import { formatCompactCurrency } from "./money-utils";
import type { Currency, Transaction } from "./types";
import { cn } from "~/lib/utils";

interface MonthDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currency: Currency;
  income: number;
  fixed: number;
  saved: number;
  spent: number;
  savingsGoal: number;
  transactions: Transaction[];
  status: 'safe' | 'warning' | 'danger';
}

export function MonthDetailsDialog({
  isOpen,
  onClose,
  title,
  currency,
  income,
  fixed,
  saved,
  spent,
  savingsGoal,
  transactions,
  status
}: MonthDetailsDialogProps) {
  
  const savedPercent = savingsGoal > 0 ? (saved / savingsGoal) * 100 : 0;
  const isPositive = saved >= 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {title}
            {status === 'safe' && <Badge className="bg-green-500 hover:bg-green-600">On Track</Badge>}
            {status === 'warning' && <Badge className="bg-yellow-500 hover:bg-yellow-600">Tight</Badge>}
            {status === 'danger' && <Badge variant="destructive">Over Budget</Badge>}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Net Saved</span>
              <div className={cn("text-2xl font-bold flex items-center gap-2", isPositive ? "text-green-600" : "text-red-600")}>
                {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {formatCompactCurrency(saved, currency)}
              </div>
            </div>
            <div className="space-y-2 text-right">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Savings Goal</span>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  Target: {formatCompactCurrency(savingsGoal, currency)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  ({Math.round(savedPercent)}% of goal)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm font-medium">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-muted-foreground" />
                Month Breakdown
              </div>
            </div>

            <div className="h-6 w-full flex rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <div style={{ width: `${Math.min(100, Math.max(0, (fixed / income) * 100))}%` }} className="h-full bg-slate-400 dark:bg-slate-600" title="Fixed Expenses" />
              <div style={{ width: `${Math.min(100, Math.max(0, (spent / income) * 100))}%` }} className="h-full bg-orange-400" title="Play Spending" />
              <div style={{ width: `${Math.min(100, Math.max(0, (saved / income) * 100))}%` }} className="h-full bg-green-500" title="Saved" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="p-2 rounded bg-slate-100 dark:bg-slate-800">
                <div className="font-bold text-slate-500">Fixed</div>
                <div>{formatCompactCurrency(fixed, currency)}</div>
              </div>
              <div className="p-2 rounded bg-orange-50 dark:bg-orange-900/20">
                <div className="font-bold text-orange-600">Spent</div>
                <div>{formatCompactCurrency(spent, currency)}</div>
              </div>
              <div className="p-2 rounded bg-green-50 dark:bg-green-900/20">
                <div className="font-bold text-green-600">Saved</div>
                <div>{formatCompactCurrency(saved, currency)}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-muted-foreground" />
              Spending History
            </div>
            <ScrollArea className="h-32 rounded-md border p-2">
              {transactions && transactions.length > 0 ? (
                <div className="space-y-2">
                  {transactions.map((tx, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{tx.description}</span>
                      <span className="font-medium text-red-500">
                        - {formatCompactCurrency(tx.amount, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                   No detailed history available for this month.
                </p>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
