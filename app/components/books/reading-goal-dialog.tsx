import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { BookSettings, BookGoalType } from "./types";

interface ReadingGoalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currentSettings: BookSettings;
    onSave: (settings: BookSettings) => void;
}

export function ReadingGoalDialog({ isOpen, onClose, currentSettings, onSave }: ReadingGoalDialogProps) {
    const [goalType, setGoalType] = useState<BookGoalType>(currentSettings.goalType);
    const [goalAmount, setGoalAmount] = useState(currentSettings.goalAmount.toString());

    useEffect(() => {
        if (isOpen) {
            setGoalType(currentSettings.goalType);
            setGoalAmount(currentSettings.goalAmount.toString());
        }
    }, [isOpen, currentSettings]);

    const handleSave = () => {
        const amount = parseInt(goalAmount);
        if (amount > 0) {
            onSave({
                goalType,
                goalAmount: amount
            });
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[90vw] sm:max-w-md rounded-lg">
                <DialogHeader>
                    <DialogTitle>Set Yearly Reading Goal</DialogTitle>
                    <DialogDescription>Challenge yourself to read more this year.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label>Goal Type</Label>
                        <Select value={goalType} onValueChange={(v: BookGoalType) => setGoalType(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="books">Books per Year</SelectItem>
                                <SelectItem value="pages">Pages per Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Target Amount</Label>
                        <Input 
                            type="number" 
                            value={goalAmount} 
                            onChange={(e) => setGoalAmount(e.target.value)} 
                            placeholder={goalType === 'books' ? "12" : "5000"}
                        />
                        <p className="text-xs text-muted-foreground">
                            {goalType === 'books' ? "e.g. 1 book per month = 12" : "e.g. 20 pages per day ≈ 7300 pages"}
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Goal</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
