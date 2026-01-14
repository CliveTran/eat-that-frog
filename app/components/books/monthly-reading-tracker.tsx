import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { BarChart3 } from "lucide-react";

interface MonthlyStats {
    month: number;
    name: string;
    pages: number;
}

interface MonthlyReadingTrackerProps {
    data: MonthlyStats[];
    goalPerPage: number; 
}

export function MonthlyReadingTracker({ data }: MonthlyReadingTrackerProps) {
  const maxPages = Math.max(...data.map(d => d.pages), 300); 

  return (
    <Card className="shadow-sm h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold">Monthly Breakdown</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4 flex-1">
        <div className="relative h-48 w-full">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between text-xs text-muted-foreground/30 font-medium">
                <div className="border-b border-dashed w-full" />
                <div className="border-b border-dashed w-full" />
                <div className="border-b border-dashed w-full" />
                <div className="border-b border-dashed w-full" />
            </div>

            {/* Bars */}
            <div className="absolute inset-x-0 bottom-0 top-0 flex items-end justify-between gap-1 pt-6 pb-6 pl-1">
                {data.map((d) => {
                const heightPercent = Math.max(0, Math.round((d.pages / maxPages) * 100));
                return (
                    <div key={d.month} className="flex flex-col items-center flex-1 h-full justify-end group relative">
                        {/* Tooltip-like Label on Hover */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap z-10 pointer-events-none mb-1">
                             <span className="font-semibold">{d.pages}</span> pages
                             <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-popover rotate-45" />
                        </div>

                        {/* Bar */}
                        <div 
                            className="w-full max-w-[24px] bg-primary/20 hover:bg-primary/80 rounded-t-sm transition-all duration-300 relative"
                            style={{ height: `${heightPercent || 2}%` }} // Min height for empty bars to be visible as landing pads
                        >
                            {/* Inner Bar for animation/style */}
                            {d.pages > 0 && (
                                <div 
                                    className="w-full bg-primary absolute bottom-0 rounded-t-sm transition-all duration-500 opacity-60 group-hover:opacity-100"
                                    style={{ height: `100%` }}
                                />
                            )}
                        </div>
                    </div>
                )
                })}
            </div>

            {/* X-Axis Labels */}
            <div className="absolute bottom-0 inset-x-0 flex justify-between gap-1 pl-1">
                 {data.map((d) => (
                     <div key={d.month} className="flex-1 text-center">
                         <span className="text-[10px] text-muted-foreground font-medium uppercase">{d.name}</span>
                     </div>
                 ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
