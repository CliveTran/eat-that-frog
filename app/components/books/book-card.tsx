import { useMemo } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { BookOpen, CheckCircle2, Clock, MoreHorizontal, PlayCircle } from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import type { Book } from "./types";

interface BookCardProps {
    book: Book;
    onLogSession: (book: Book) => void;
    onStatusChange: (bookId: string, status: Book['status']) => void;
    onDelete: (bookId: string) => void;
}

export function BookCard({ book, onLogSession, onStatusChange, onDelete }: BookCardProps) {
    const percent = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));
    
    return (
        <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-all group relative">
            {/* Book Spine / Visual Cover */}
            <div className={cn("h-32 w-full relative p-4 flex flex-col justify-end", book.coverColor)}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="relative text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-sm">
                    {book.title}
                </h3>
                <p className="relative text-white/90 text-sm font-medium drop-shadow-sm">
                    {book.author}
                </p>
                
                {book.status === 'completed' && (
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm p-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                )}
            </div>

            <CardContent className="flex-1 p-4 flex flex-col gap-3">
                
                {/* Status Badge & Actions */}
                <div className="flex justify-between items-start">
                    <Badge variant={book.status === 'reading' ? 'default' : 'secondary'} className="capitalize">
                        {book.status.replace(/-/g, ' ')}
                    </Badge>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onStatusChange(book.id, 'reading')}>
                                Move to Reading
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange(book.id, 'want-to-read')}>
                                Move to Want to Read
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange(book.id, 'completed')}>
                                Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(book.id)}>
                                Delete Book
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Progress */}
                <div className="space-y-1 mt-auto">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{book.currentPage} / {book.totalPages} p</span>
                        <span>{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                </div>

                {/* Action Button */}
                {book.status === 'reading' ? (
                    <Button 
                        size="sm" 
                        className="w-full mt-2 gap-2" 
                        onClick={() => onLogSession(book)}
                    >
                        <PlayCircle className="w-4 h-4" /> Log Reading
                    </Button>
                ) : book.status === 'want-to-read' ? (
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={() => onStatusChange(book.id, 'reading')}
                    >
                        Start Reading
                    </Button>
                ) : null}
            </CardContent>
        </Card>
    );
}
