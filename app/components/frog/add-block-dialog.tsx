import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { BLOCK_COLORS, BLOCK_TIMES } from "~/lib/constants";
import { cn } from "~/lib/utils";
import type { ScheduleBlock } from "~/types";
import { useState, useEffect } from "react";

interface AddBlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBlockAdd: (block: ScheduleBlock) => void;
}

export function AddBlockDialog({ open, onOpenChange, onBlockAdd }: AddBlockDialogProps) {
    const [newBlockTitle, setNewBlockTitle] = useState("");
    const [newBlockStart, setNewBlockStart] = useState("09:00");
    const [newBlockEnd, setNewBlockEnd] = useState("17:00");
    const [newBlockColor, setNewBlockColor] = useState(BLOCK_COLORS[0].value);

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            setNewBlockTitle("");
            setNewBlockStart("09:00");
            setNewBlockEnd("17:00");
            setNewBlockColor(BLOCK_COLORS[0].value);
        }
    }, [open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBlockTitle.trim()) return;

        const newBlock: ScheduleBlock = {
            id: crypto.randomUUID(),
            title: newBlockTitle,
            startTime: newBlockStart,
            endTime: newBlockEnd,
            color: newBlockColor,
        };
        
        onBlockAdd(newBlock);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Schedule Block</DialogTitle>
                    <DialogDescription>Define a high-level time block (e.g., Work, Gym, Study).</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Block Name</Label>
                        <Input placeholder="e.g. Deep Work" value={newBlockTitle} onChange={e => setNewBlockTitle(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Select value={newBlockStart} onValueChange={setNewBlockStart}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {BLOCK_TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>End Time</Label>
                            <Select value={newBlockEnd} onValueChange={setNewBlockEnd}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {BLOCK_TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="flex flex-wrap gap-2">
                            {BLOCK_COLORS.map(c => (
                                <div 
                                    key={c.label} 
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 cursor-pointer transition-all", 
                                        c.value.split(" ")[0], 
                                        newBlockColor === c.value ? "ring-2 ring-offset-2 ring-black dark:ring-white scale-110" : "border-transparent"
                                    )}
                                    onClick={() => setNewBlockColor(c.value)}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create Block</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
