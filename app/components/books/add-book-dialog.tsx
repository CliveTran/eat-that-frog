import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { BOOK_COLORS, type Book } from "./types";
import { cn } from "~/lib/utils";
import { Check } from "lucide-react";

interface AddBookDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (book: Book) => void;
}

export function AddBookDialog({ isOpen, onClose, onAdd }: AddBookDialogProps) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [pages, setPages] = useState("");
    const [color, setColor] = useState(BOOK_COLORS[0]);

    const handleSave = () => {
        if (!title || !pages) return;

        const newBook: Book = {
            id: crypto.randomUUID(),
            title,
            author: author || "Unknown Author",
            totalPages: parseInt(pages) || 0,
            currentPage: 0,
            status: "want-to-read",
            coverColor: color,
        };

        onAdd(newBook);
        onClose();
        // Reset form
        setTitle("");
        setAuthor("");
        setPages("");
        setColor(BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)]);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[90vw] sm:max-w-md rounded-lg">
                <DialogHeader>
                    <DialogTitle>Add New Book</DialogTitle>
                    <DialogDescription>Add a book to your tracking list.</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="e.g. Atomic Habits"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Author</Label>
                        <Input 
                            value={author} 
                            onChange={(e) => setAuthor(e.target.value)} 
                            placeholder="e.g. James Clear"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Total Pages</Label>
                        <Input 
                            type="number" 
                            value={pages} 
                            onChange={(e) => setPages(e.target.value)} 
                            placeholder="320"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Cover Color</Label>
                        <div className="flex flex-wrap gap-2">
                            {BOOK_COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={cn(
                                        "w-6 h-6 rounded-full transition-all flex items-center justify-center",
                                        c,
                                        color === c ? "ring-2 ring-offset-2 ring-primary scale-110" : "opacity-70 hover:opacity-100"
                                    )}
                                    onClick={() => setColor(c)}
                                >
                                    {color === c && <Check className="w-3 h-3 text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={!title || !pages}>Add Book</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
