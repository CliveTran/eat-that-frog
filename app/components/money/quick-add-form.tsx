import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { DollarSign, Plus, AlertCircle } from "lucide-react";
import { formatWithDots } from "./money-utils";
import type { Currency } from "./types";

interface QuickAddFormProps {
  currency: Currency;
  onAdd: (amount: number, description: string) => void;
}

export function QuickAddForm({ currency, onAdd }: QuickAddFormProps) {
  const [form, setForm] = useState({ amount: "", description: "" });

  const handleSubmit = () => {
    const numericAmount = Number(form.amount.replace(/\./g, ""));
    if (numericAmount > 0) {
      onAdd(numericAmount, form.description);
      setForm({ amount: "", description: "" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Spent Something?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="relative">
              {currency === "USD" ? (
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              ) : (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                  ₫
                </span>
              )}
              <Input 
                type="text" 
                inputMode="numeric"
                placeholder="0" 
                className="pl-9 text-lg font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                value={formatWithDots(form.amount)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\./g, "");
                  if (/^\d*$/.test(raw)) {
                    setForm({ ...form, amount: raw });
                  }
                }}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>What for?</Label>
            <Input 
              placeholder="Coffee, Lunch, Uber..." 
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button className="w-full" size="lg" onClick={handleSubmit} disabled={!form.amount}>
            <Plus className="w-4 h-4 mr-2" /> Add Expense
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
         <CardContent className="p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Tip:</strong> Don't track rent or bills here. Only track "Play Money" spending to keep this number accurate.
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
