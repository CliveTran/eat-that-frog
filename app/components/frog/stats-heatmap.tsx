import { Card, CardContent } from "~/components/ui/card";
import { Flame } from "lucide-react";
import type { DailyStats } from "~/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface StatsHeatmapProps {
  dailyStats: DailyStats[];
}

export function StatsHeatmap({ dailyStats }: StatsHeatmapProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <h2 className="text-xl font-semibold tracking-tight">Daily Progress ({new Date().getFullYear()})</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-green-500"></div>
            <span>Frog Eaten</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/50"></div>
            <span>Tasks Done</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-red-200 dark:bg-red-900/50"></div>
            <span>No Activity</span>
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, monthIndex) => {
              const currentYear = new Date().getFullYear();
              const date = new Date(Date.UTC(currentYear, monthIndex, 1));
              const monthName = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
              const daysInMonth = new Date(Date.UTC(currentYear, monthIndex + 1, 0)).getUTCDate();

              return (
                <div key={monthIndex} className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">{monthName}</h3>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                      const dayDate = new Date(Date.UTC(currentYear, monthIndex, dayIndex + 1));
                      const dateStr = dayDate.toISOString().split('T')[0];
                      const todayStr = new Date().toISOString().split('T')[0];
                      const isToday = dateStr === todayStr;
                      const stat = dailyStats.find(s => s.date === dateStr);
                      
                      let bgClass = "bg-slate-100 dark:bg-slate-800";
                      if (stat) {
                        if (stat.frogEaten) bgClass = "bg-green-500";
                        else if (stat.tasksCompleted > 0)
                          bgClass = "bg-green-200 dark:bg-green-900/50";
                      } else if (dateStr < todayStr) {
                        // Past days with no stats
                        bgClass = "bg-red-50 dark:bg-red-900/20";
                      } else if (isToday) {
                         bgClass = "bg-red-500 animate-pulse";
                      }

                      return (
                        <Tooltip key={dayIndex}>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-3 h-3 rounded-sm ${bgClass} ${
                                isToday
                                  ? "ring-2 ring-red-500 ring-offset-2 ring-offset-background"
                                  : ""
                              }`}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold">
                              {dayDate.toLocaleDateString(undefined, {
                                timeZone: "UTC",
                                dateStyle: "medium",
                              })}
                            </p>
                            {stat ? (
                              <p className="text-xs text-muted-foreground">
                                {stat.tasksCompleted} tasks
                                {stat.frogEaten && ", Frog Eaten"}
                              </p>
                            ) : (
                              <p className="text-xs text-muted-foreground">
                                No activity
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
