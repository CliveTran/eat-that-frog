import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Calendar } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "~/components/ui/tooltip";

interface DailyReadingTrackerProps {
    dailyPagesMap: Map<string, number>;
}

export function DailyReadingTracker({ dailyPagesMap }: DailyReadingTrackerProps) {
    const currentYear = new Date().getFullYear();
    // Use local date string for 'today' comparison
    const todayStr = new Date().toLocaleDateString('en-CA');

    const getIntensityClass = (pages: number) => {
        if (pages === 0) return "bg-slate-100 dark:bg-slate-800";
        if (pages < 10) return "bg-green-200 dark:bg-green-800";
        if (pages < 30) return "bg-green-300 dark:bg-green-700";
        if (pages < 60) return "bg-green-400 dark:bg-green-600";
        return "bg-green-500 dark:bg-green-500";
    };

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base font-semibold">Reading Activity</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-100 dark:bg-slate-800 rounded-sm"></div> 0 pages</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-200 dark:bg-green-800 rounded-sm"></div> 1-9 pages</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 dark:bg-green-500 rounded-sm"></div> 60+ pages</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <TooltipProvider delayDuration={100}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-6">
                        {Array.from({ length: 12 }).map((_, monthIndex) => {
                            // Construct date using local time
                            const date = new Date(currentYear, monthIndex, 1);
                            // Use en-US to ensure consistency between server (SSR) and client hydration
                            const monthName = date.toLocaleString('en-US', { month: 'short' });
                            // Get days in month properly for local time year/month 
                            // (day 0 of next month gives last day of current month)
                            const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();

                            return (
                                <div key={monthIndex} className="flex gap-2">
                                    <span className="text-[10px] w-6 font-medium text-muted-foreground pt-1">{monthName}</span>
                                    <div className="flex flex-wrap gap-1 flex-1">
                                        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                                            const dayDate = new Date(currentYear, monthIndex, dayIndex + 1);
                                            const dateStr = dayDate.toLocaleDateString('en-CA');
                                            const pages = dailyPagesMap.get(dateStr) || 0;
                                            const isToday = dateStr === todayStr;

                                            let intensityClass = getIntensityClass(pages);
                                            if (isToday && pages === 0) {
                                                intensityClass = "bg-red-500 animate-pulse";
                                            }

                                            return (
                                                <Tooltip key={dayIndex}>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            className={`w-2.5 h-2.5 rounded-sm transition-all hover:ring-1 hover:ring-ring ${intensityClass} ${isToday ? "ring-2 ring-red-500 ring-offset-2 ring-offset-background" : ""
                                                                }`}
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        <p className="font-semibold text-xs">
                                                            {dayDate.toLocaleDateString(undefined, {
                                                                month: 'short', day: 'numeric'
                                                            })}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground">
                                                            {pages > 0 ? `${pages} pages` : 'No reading'}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
}
