import { useState, useEffect, useMemo } from "react";
import type { Route } from "./+types/books";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { PlusCircle, Library, BookOpen, CheckCircle2 } from "lucide-react";
import { AddBookDialog } from "~/components/books/add-book-dialog";
import { ReadingLogDialog } from "~/components/books/reading-log-dialog";
import { ReadingGoalDialog } from "~/components/books/reading-goal-dialog";
import { BookCard } from "~/components/books/book-card";
import { StatsOverview } from "~/components/books/stats-overview";
import { DailyReadingTracker } from "~/components/books/daily-reading-tracker";
import { MonthlyReadingTracker } from "~/components/books/monthly-reading-tracker";
import { calculateYearStats, getDailyPagesMap, getMonthlyStats } from "~/components/books/books-utils";
import type { Book, ReadingSession, BookStatus, BookSettings } from "~/components/books/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Books - Leap" },
    { name: "description", content: "Track your reading journey." },
  ];
}

const DEFAULT_SETTINGS: BookSettings = {
    goalType: 'books',
    goalAmount: 12
};

export default function Books() {
  // --- State ---
  const [books, setBooks] = useState<Book[]>([]);
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [settings, setSettings] = useState<BookSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Dialog State
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const [activeBookForLog, setActiveBookForLog] = useState<Book | null>(null);

  // --- Persistence ---
  useEffect(() => {
    const savedBooks = localStorage.getItem("frog_books");
    const savedSessions = localStorage.getItem("frog_reading_sessions");
    const savedSettings = localStorage.getItem("frog_book_settings");
    
    if (savedBooks) {
        try { setBooks(JSON.parse(savedBooks)); } catch (e) { console.error(e); }
    } else {
        // Initial Seed Data if empty
        setBooks([]); 
    }

    if (savedSessions) {
        try { setSessions(JSON.parse(savedSessions)); } catch (e) { console.error(e); }
    }

    if (savedSettings) {
        try { setSettings(JSON.parse(savedSettings)); } catch (e) { console.error(e); }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
        localStorage.setItem("frog_books", JSON.stringify(books));
    }
  }, [books, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
        localStorage.setItem("frog_reading_sessions", JSON.stringify(sessions));
    }
  }, [sessions, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
        localStorage.setItem("frog_book_settings", JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  // --- Handlers ---
  const handleAddBook = (newBook: Book) => {
    setBooks(prev => [newBook, ...prev]);
  };

  const handleUpdateStatus = (bookId: string, status: BookStatus) => {
    setBooks(prev => prev.map(b => {
        if (b.id !== bookId) return b;
        
        const updates: Partial<Book> = { status };
        if (status === 'reading' && !b.startDate) {
            updates.startDate = new Date().toISOString();
        }
        if (status === 'completed' && !b.finishDate) {
            updates.finishDate = new Date().toISOString();
            updates.currentPage = b.totalPages; // Ensure it's marked as done
        }
        return { ...b, ...updates };
    }));
  };

  const handleDeleteBook = (bookId: string) => {
    if (confirm("Are you sure? This will delete the book and its history.")) {
        setBooks(prev => prev.filter(b => b.id !== bookId));
        setSessions(prev => prev.filter(s => s.bookId !== bookId));
    }
  };

  const handleLogSession = (sessionId: string, bookId: string, pages: number, minutes: number, notes?: string) => {
    const newSession: ReadingSession = {
        id: sessionId,
        bookId,
        date: new Date().toISOString(),
        pagesRead: pages,
        durationMinutes: minutes,
        notes
    };

    setSessions(prev => [...prev, newSession]);

    // Update Book Progress
    setBooks(prev => prev.map(b => {
        if (b.id !== bookId) return b;
        const newPage = Math.min(b.totalPages, b.currentPage + pages);
        const autoComplete = newPage >= b.totalPages;
        
        return {
            ...b,
            currentPage: newPage,
            status: autoComplete ? 'completed' : b.status,
            finishDate: autoComplete ? new Date().toISOString() : b.finishDate
        };
    }));
  };

  // --- Derived Data ---
  const stats = useMemo(() => calculateYearStats(sessions, books), [sessions, books]);
  const dailyPagesMap = useMemo(() => getDailyPagesMap(sessions), [sessions]);
  const monthlyStats = useMemo(() => getMonthlyStats(sessions), [sessions]);
  
  const readingBooks = books.filter(b => b.status === 'reading');
  const wantToReadBooks = books.filter(b => b.status === 'want-to-read');
  const completedBooks = books.filter(b => b.status === 'completed');

  return (
    <div className="container py-8 max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Library</h1>
                <p className="text-muted-foreground">Track your reading, speed, and history.</p>
            </div>
            <Button onClick={() => setIsAddBookOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Book
            </Button>
        </div>

        {/* Stats */}
        <StatsOverview 
            totalPages={stats.totalPagesRead}
            totalMinutes={stats.totalMinutesRead}
            booksFinished={stats.finishedBooks}
            avgSpeed={stats.avgSpeed}
            settings={settings}
            onEditGoal={() => setIsGoalOpen(true)}
        />

        {/* Detailed Trackers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <DailyReadingTracker dailyPagesMap={dailyPagesMap} />
            </div>
            <div>
                <MonthlyReadingTracker data={monthlyStats} goalPerPage={0} />
            </div>
        </div>

        {/* Tabs for Views */}
        <Tabs defaultValue="reading" className="space-y-6">
            <TabsList>
                <TabsTrigger value="reading" className="gap-2">
                    <BookOpen className="h-4 w-4" /> Reading <span className="opacity-50">({readingBooks.length})</span>
                </TabsTrigger>
                <TabsTrigger value="tbr" className="gap-2">
                    <Library className="h-4 w-4" /> To Read <span className="opacity-50">({wantToReadBooks.length})</span>
                </TabsTrigger>
                <TabsTrigger value="completed" className="gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Completed <span className="opacity-50">({completedBooks.length})</span>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="reading" className="space-y-4">
               {readingBooks.length === 0 ? (
                 <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">You aren't reading any books right now.</p>
                    <Button variant="outline" onClick={() => setIsAddBookOpen(true)}>Start a new book</Button>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {readingBooks.map(book => (
                        <BookCard 
                            key={book.id} 
                            book={book} 
                            onLogSession={(b) => setActiveBookForLog(b)}
                            onStatusChange={handleUpdateStatus}
                            onDelete={handleDeleteBook}
                        />
                    ))}
                 </div>
               )}
            </TabsContent>

            <TabsContent value="tbr">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wantToReadBooks.map(book => (
                        <BookCard 
                            key={book.id} 
                            book={book} 
                            onLogSession={(b) => setActiveBookForLog(b)}
                            onStatusChange={handleUpdateStatus}
                            onDelete={handleDeleteBook}
                        />
                    ))}
                    {wantToReadBooks.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            Your reading list is empty. Time to go shopping?
                        </div>
                    )}
                 </div>
            </TabsContent>

            <TabsContent value="completed">
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {completedBooks.map(book => (
                         <BookCard 
                            key={book.id} 
                            book={book} 
                            onLogSession={(b) => setActiveBookForLog(b)}
                            onStatusChange={handleUpdateStatus}
                            onDelete={handleDeleteBook}
                        />
                    ))}
                    {completedBooks.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No finished books yet. Keep going!
                        </div>
                    )}
                 </div>
            </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <AddBookDialog 
            isOpen={isAddBookOpen} 
            onClose={() => setIsAddBookOpen(false)} 
            onAdd={handleAddBook} 
        />
        
        <ReadingLogDialog 
            book={activeBookForLog}
            isOpen={!!activeBookForLog}
            onClose={() => setActiveBookForLog(null)}
            onSave={handleLogSession}
        />

        <ReadingGoalDialog 
            isOpen={isGoalOpen}
            onClose={() => setIsGoalOpen(false)}
            currentSettings={settings}
            onSave={setSettings}
        />
    </div>
  );
}
