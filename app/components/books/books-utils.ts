import type { Book, ReadingSession } from "./types";

export const calculateWPM = (pages: number, minutes: number, wordsPerPage: number = 300) => {
    if (minutes <= 0) return 0;
    return Math.round((pages * wordsPerPage) / minutes);
};

export const calculatePagesPerHour = (pages: number, minutes: number) => {
    if (minutes <= 0) return 0;
    return Math.round((pages / minutes) * 60);
};

export const getEstimateRemainingTime = (book: Book, avgMinutesPerPage: number) => {
    const remainingPages = book.totalPages - book.currentPage;
    if (remainingPages <= 0) return 0;
    return Math.round(remainingPages * avgMinutesPerPage); // Returns minutes
};

export const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
};

export const getTodaySessions = (sessions: ReadingSession[]) => {
    const today = new Date().toDateString();
    return sessions.filter(s => new Date(s.date).toDateString() === today);
};

export const getYearSessions = (sessions: ReadingSession[]) => {
    const currentYear = new Date().getFullYear();
    return sessions.filter(s => new Date(s.date).getFullYear() === currentYear);
};

// Returns stats for the current year
export const calculateYearStats = (sessions: ReadingSession[], books: Book[]) => {
    const yearSessions = getYearSessions(sessions);
    
    const totalPagesRead = yearSessions.reduce((acc, s) => acc + s.pagesRead, 0);
    const totalMinutesRead = yearSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    
    // Books finished this year
    const finishedBooks = books.filter(b => 
        b.status === 'completed' && 
        b.finishDate && 
        new Date(b.finishDate).getFullYear() === new Date().getFullYear()
    ).length;

    // Reading Speed (Pages/Hour)
    const avgSpeed = totalMinutesRead > 0 
        ? Math.round((totalPagesRead / totalMinutesRead) * 60)
        : 0;

    return {
        totalPagesRead,
        totalMinutesRead,
        finishedBooks,
        avgSpeed
    };
};

// Aggregates for heatmaps
export const getDailyPagesMap = (sessions: ReadingSession[]) => {
    const map = new Map<string, number>();
    sessions.forEach(s => {
        // Use local date string to match the UI which now uses local date
        // .toLocaleDateString('en-CA') returns YYYY-MM-DD
        const dateStr = new Date(s.date).toLocaleDateString('en-CA');
        map.set(dateStr, (map.get(dateStr) || 0) + s.pagesRead);
    });
    return map;
};

// Aggregates for bar charts
export const getMonthlyStats = (sessions: ReadingSession[]) => {
    const currentYear = new Date().getFullYear();
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        month: i,
        // Use en-US for consistent hydration
        name: new Date(currentYear, i).toLocaleString('en-US', { month: 'short' }),
        pages: 0,
        booksFinished: 0
    }));

    sessions.forEach(s => {
        const date = new Date(s.date);
        if (date.getFullYear() === currentYear) {
            monthlyData[date.getMonth()].pages += s.pagesRead;
        }
    });

    return monthlyData;
};
