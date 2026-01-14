import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import type { Book, ReadingSession } from "./types";
import { calculatePagesPerHour } from "./books-utils";

interface ReadingLogDialogProps {
    book: Book | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (sessionId: string, bookId: string, pages: number, minutes: number, notes?: string) => void;
}

export function ReadingLogDialog({ book, isOpen, onClose, onSave }: ReadingLogDialogProps) {
    const [pagesRead, setPagesRead] = useState("");
    const [minutes, setMinutes] = useState("30");
    const [notes, setNotes] = useState("");

    // Calculated speed preview
    const speed = (pagesRead && minutes) ? calculatePagesPerHour(parseInt(pagesRead), parseInt(minutes)) : 0;

    const handleSubmit = () => {
        if (!book || !pagesRead || !minutes) return;
        
        const p = parseInt(pagesRead);
        const m = parseInt(minutes);
        
        if (p > 0 && m > 0) {
            onSave(crypto.randomUUID(), book.id, p, m, notes);
            setPagesRead("");
            setMinutes("30");
            setNotes("");
            onClose();
        }
    };

    if (!book) return null;

    const remainingPages = book.totalPages - book.currentPage;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[90vw] sm:max-w-md rounded-lg">
                <DialogHeader>
                    <DialogTitle>Log Reading Session</DialogTitle>
                    <DialogDescription>
                        You're reading <span className="font-semibold text-primary">{book.title}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Pages Read</Label>
                            <Input 
                                type="number" 
                                value={pagesRead} 
                                onChange={(e) => setPagesRead(e.target.value)}
                                placeholder="0"
                                autoFocus
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Max {remainingPages} pages left
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>Time (Minutes)</Label>
                            <Input 
                                type="number" 
                                value={minutes} 
                                onChange={(e) => setMinutes(e.target.value)}
                                placeholder="30"
                            />
                        </div>
                    </div>

                    {speed > 0 && (
                        <div className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded-md">
                            <span className="text-muted-foreground">Estimated Speed</span>
                            <span className="font-mono font-bold text-primary">{speed} pages/hr</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Quick Notes (Optional)</Label>
                        <Textarea 
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="What stuck with you?"
                            className="resize-none h-20"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!pagesRead || !minutes}>Log Session</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
