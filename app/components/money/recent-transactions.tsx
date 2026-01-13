import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuItem 
} from "~/components/ui/dropdown-menu";
import { 
  ArrowUpDown, 
  Check, 
  Pencil, 
  Trash2, 
  X, 
  PiggyBank, 
  DollarSign 
} from "lucide-react";
import { formatCurrency, formatWithDots } from "./money-utils";
import type { Currency, Transaction } from "./types";

interface RecentTransactionsProps {
  transactions: Transaction[];
  currency: Currency;
  onUpdate: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export function RecentTransactions({ transactions, currency, onUpdate, onDelete }: RecentTransactionsProps) {
  const [sortConfig, setSortConfig] = useState<{ 
    key: 'date' | 'amount' | 'description', 
    direction: 'asc' | 'desc' 
  }>({ key: 'date', direction: 'desc' });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ amount: "", description: "" });

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortConfig.key === 'description') {
         return sortConfig.direction === 'asc' 
           ? a.description.localeCompare(b.description)
           : b.description.localeCompare(a.description);
      } else {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [transactions, sortConfig]);

  const handleStartEdit = (t: Transaction) => {
    setEditingId(t.id);
    setEditForm({ amount: t.amount.toString(), description: t.description });
  };

  const handleDisplayCancel = () => {
    setEditingId(null);
    setEditForm({ amount: "", description: "" });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const numericAmount = Number(editForm.amount.replace(/\./g, ""));
    const original = transactions.find(t => t.id === editingId);
    
    if (numericAmount > 0 && original) {
      onUpdate({
        ...original,
        amount: numericAmount,
        description: editForm.description
      });
      handleDisplayCancel();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
         <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent "Play Money" Spending</CardTitle>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortConfig({key: 'date', direction: 'desc'})}>
                      Newest First {sortConfig.key === 'date' && sortConfig.direction === 'desc' && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortConfig({key: 'date', direction: 'asc'})}>
                      Oldest First {sortConfig.key === 'date' && sortConfig.direction === 'asc' && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortConfig({key: 'amount', direction: 'desc'})}>
                      Amount (High to Low) {sortConfig.key === 'amount' && sortConfig.direction === 'desc' && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortConfig({key: 'amount', direction: 'asc'})}>
                      Amount (Low to High) {sortConfig.key === 'amount' && sortConfig.direction === 'asc' && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortConfig({key: 'description', direction: 'asc'})}>
                      Name (A-Z) {sortConfig.key === 'description' && sortConfig.direction === 'asc' && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortConfig({key: 'description', direction: 'desc'})}>
                      Name (Z-A) {sortConfig.key === 'description' && sortConfig.direction === 'desc' && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[400px]">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground space-y-2">
              <PiggyBank className="w-12 h-12 opacity-20" />
              <p>No transactions yet.</p>
              <p className="text-xs">Enjoy your full daily budget!</p>
            </div>
          ) : (
            <div className="divide-y">
              {sortedTransactions.map((t) => (
                <div key={t.id} className="group flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  {editingId === t.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <div className="flex-1 space-y-2">
                          <Input 
                            value={editForm.description}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            className="h-8 text-sm"
                            placeholder="Description"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                          />
                          <div className="relative">
                              {currency === "USD" ? (
                                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                              ) : (
                                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">₫</span>
                              )}
                              <Input 
                                  value={formatWithDots(editForm.amount)}
                                  onChange={(e) => {
                                      const raw = e.target.value.replace(/\./g, "");
                                      if (/^\d*$/.test(raw)) {
                                          setEditForm({ ...editForm, amount: raw });
                                      }
                                  }}
                                  className="h-8 pl-6 text-sm"
                                  placeholder="Amount"
                                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                              />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={handleSaveEdit}>
                                <Check className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-50" onClick={handleDisplayCancel}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                      </div>
                  ) : (
                      <>
                      <div className="flex flex-col">
                        <span className="font-medium">{t.description}</span>
                        <span className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-red-500">
                          - {formatCurrency(t.amount, currency)}
                        </div>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => handleStartEdit(t)}
                              aria-label="Edit transaction"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => onDelete(t.id)}
                              aria-label="Delete transaction"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                      </div>
                      </>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
