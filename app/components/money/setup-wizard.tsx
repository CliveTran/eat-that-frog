import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { DollarSign, Coins, CreditCard, PiggyBank } from "lucide-react";
import { cn } from "~/lib/utils";
import type { MoneyProfile, Currency } from "./types";
import { formatWithDots, CURRENT_MONTH } from "./money-utils";

interface SetupWizardProps {
  initialData?: MoneyProfile;
  onSave: (profile: MoneyProfile) => void;
  onCancel?: () => void;
}

export function SetupWizard({ initialData, onSave, onCancel }: SetupWizardProps) {
  const [setupForm, setSetupForm] = useState({
    income: "",
    fixed: "",
    savings: "",
    currency: "USD" as Currency,
  });
  
  const [setupTouched, setSetupTouched] = useState({
    income: false,
    fixed: false,
    savings: false,
  });

  useEffect(() => {
    if (initialData) {
      setSetupForm({
        income: initialData.monthlyIncome.toString(),
        fixed: initialData.fixedExpenses.toString(),
        savings: initialData.savingsGoal.toString(),
        currency: initialData.currency,
      });
    }
  }, [initialData]);

  const incomeVal = Number(setupForm.income || 0);
  const fixedVal = Number(setupForm.fixed || 0);
  const maxSavings = Math.max(0, incomeVal - fixedVal);
  const savingsVal = Number(setupForm.savings || 0);

  const setupErrors = {
    income: 
      (setupTouched.income && !setupForm.income) ? "Income is required" : 
      (setupTouched.income && incomeVal < 1) ? "Income must be greater than 0" :
      "",
    fixed: 
      (setupTouched.fixed && !setupForm.fixed) ? "Fixed expenses are required (enter 0 if none)" : 
      (fixedVal > incomeVal) ? "Fixed expenses cannot exceed monthly income" :
      "",
    savings: 
      (setupTouched.savings && !setupForm.savings) ? "Savings goal is required (enter 0 if none)" : 
      (savingsVal > maxSavings) ? `Savings goal cannot exceed ${formatWithDots(maxSavings.toString())}` :
      "",
  };

  const isSetupValid = 
    setupForm.income !== "" && 
    incomeVal >= 1 &&
    setupForm.fixed !== "" && 
    setupForm.savings !== "" &&
    !setupErrors.fixed &&
    !setupErrors.savings;

  const handleSetupAmountChange = (value: string, field: keyof typeof setupForm) => {
    const rawValue = value.replace(/\./g, "");
    if (/^\d*$/.test(rawValue)) {
      setSetupForm({ ...setupForm, [field]: rawValue });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSetupValid) {
      setSetupTouched({
        income: true,
        fixed: true,
        savings: true,
      });
      return;
    }
    
    onSave({
      monthlyIncome: Number(setupForm.income),
      fixedExpenses: Number(setupForm.fixed),
      savingsGoal: Number(setupForm.savings),
      isSetup: true,
      currency: setupForm.currency,
      lastUpdatedMonth: initialData?.lastUpdatedMonth ?? CURRENT_MONTH,
    });
  };

  return (
    <Card className="w-full max-w-lg mx-auto mt-8 border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">The "One Number" Setup</CardTitle>
        <CardDescription>
          Most budgeting apps fail because they are too complex. We solve this by calculating your 
          <strong> Safe-to-Spend</strong> daily number.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form id="setup-form" onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Currency Selection */}
          <div className="space-y-2">
            <Label className="text-base">Currency</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={setupForm.currency === "USD" ? "default" : "outline"}
                className={cn("flex-1", setupForm.currency === "USD" && "ring-2 ring-primary ring-offset-2")}
                onClick={() => setSetupForm({ ...setupForm, currency: "USD" })}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                USD ($)
              </Button>
              <Button
                type="button"
                variant={setupForm.currency === "VND" ? "default" : "outline"}
                className={cn("flex-1", setupForm.currency === "VND" && "ring-2 ring-primary ring-offset-2")}
                onClick={() => setSetupForm({ ...setupForm, currency: "VND" })}
              >
                <Coins className="w-4 h-4 mr-2" />
                VND (₫)
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income" className="text-base">Monthly Income (Take-home)</Label>
            <div className="relative">
              {setupForm.currency === "USD" ? (
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              ) : (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">₫</span>
              )}
              <Input 
                id="income" 
                name="income" 
                type="text" 
                inputMode="numeric"
                placeholder="0" 
                className={cn("pl-9 text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", setupErrors.income && "border-red-500 focus-visible:ring-red-500")} 
                value={formatWithDots(setupForm.income)}
                onChange={(e) => handleSetupAmountChange(e.target.value, "income")}
                onBlur={() => setSetupTouched({...setupTouched, income: true})}
                required 
              />
            </div>
            {setupErrors.income ? (
              <p className="text-xs text-red-500 font-medium">{setupErrors.income}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Your total income after taxes.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fixed" className="text-base">Fixed Expenses</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="fixed" 
                name="fixed" 
                type="text" 
                inputMode="numeric"
                placeholder="0" 
                className={cn("pl-9 text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", setupErrors.fixed && "border-red-500 focus-visible:ring-red-500")}
                value={formatWithDots(setupForm.fixed)}
                onChange={(e) => handleSetupAmountChange(e.target.value, "fixed")}
                onBlur={() => setSetupTouched({...setupTouched, fixed: true})}
                required 
              />
            </div>
             {setupErrors.fixed ? (
              <p className="text-xs text-red-500 font-medium">{setupErrors.fixed}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Rent, Utilities, Subscriptions, Debt payments.</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="savings" className="text-base">Savings Goal</Label>
              <Button 
                type="button" 
                variant="link" 
                className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                onClick={() => setSetupForm({ ...setupForm, savings: maxSavings.toString() })}
              >
                Max: {setupForm.currency === "VND" ? "₫" : "$"}{formatWithDots(maxSavings.toString())}
              </Button>
            </div>
            <div className="relative">
              <PiggyBank className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="savings" 
                name="savings" 
                type="text" 
                inputMode="numeric"
                placeholder="0" 
                className={cn("pl-9 text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", setupErrors.savings && "border-red-500 focus-visible:ring-red-500")}
                value={formatWithDots(setupForm.savings)}
                onChange={(e) => handleSetupAmountChange(e.target.value, "savings")}
                onBlur={() => setSetupTouched({...setupTouched, savings: true})}
                required 
              />
            </div>
             {setupErrors.savings ? (
              <p className="text-xs text-red-500 font-medium">{setupErrors.savings}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Pay yourself first. Non-negotiable savings.</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between p-6">
        {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
                Cancel
            </Button>
        )}
        <Button 
          size="lg" 
          type="submit" 
          form="setup-form" 
          className={cn("w-full sm:w-auto", onCancel && "ml-auto")}
          disabled={!isSetupValid}
        >
          Calculate My Number
        </Button>
      </CardFooter>
    </Card>
  );
}
