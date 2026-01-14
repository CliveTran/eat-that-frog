export type BookStatus = 'want-to-read' | 'reading' | 'completed' | 'on-hold';

export interface ReadingSession {
    id: string;
    bookId: string;
    date: string; // ISO string
    pagesRead: number;
    durationMinutes: number;
    notes?: string;
}

export interface Book {
    id: string;
    title: string;
    author: string;
    coverColor: string; 
    totalPages: number;
    currentPage: number;
    status: BookStatus;
    rating?: number; // 1-5
    startDate?: string;
    finishDate?: string;
}

export type BookGoalType = 'pages' | 'books';

export interface BookSettings {
    goalType: BookGoalType;
    goalAmount: number; // e.g., 5000 pages or 12 books
}

export const BOOK_COLORS = [
    "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500", 
    "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500",
    "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500",
    "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", "bg-pink-500",
    "bg-rose-500", "bg-slate-500"
];
