import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { formatDuration } from "./books-utils";
import { BookOpen, Clock, Trophy, Zap, Target } from "lucide-react";
import { Progress } from "~/components/ui/progress";
import { Button } from "~/components/ui/button";
import type { BookSettings } from "./types";

interface StatsOverviewProps {
    totalPages: number;
    totalMinutes: number;
    booksFinished: number;
    avgSpeed: number; // pages per hour
    settings: BookSettings;
    onEditGoal: () => void;
}

export function StatsOverview({ totalPages, totalMinutes, booksFinished, avgSpeed, settings, onEditGoal }: StatsOverviewProps) {
    const goalProgress = settings.goalType === 'books' 
        ? Math.min(100, Math.round((booksFinished / settings.goalAmount) * 100))
        : Math.min(100, Math.round((totalPages / settings.goalAmount) * 100));

    const goalLabel = settings.goalType === 'books' ? `${booksFinished} / ${settings.goalAmount} books` : `${totalPages} / ${settings.goalAmount} pages`;

    const getProgressColor = (percent: number) => {
        if (percent >= 100) return "bg-green-600";
        if (percent >= 75) return "bg-green-500";
        if (percent >= 40) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="space-y-4">
            {/* Goal Card - Improved Design */}
            <Card className="shadow-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-5">
                       <div className="space-y-1">
                           <div className="flex items-center gap-2 text-muted-foreground">
                                <Target className="h-4 w-4" />
                                <span className="text-sm font-medium uppercase tracking-wider">Yearly Goal</span>
                           </div>
                           <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">{settings.goalType === 'books' ? booksFinished : totalPages}</span>
                                <span className="text-muted-foreground">/ {settings.goalAmount} {settings.goalType}</span>
                           </div>
                       </div>
                       <div className="text-right">
                            <span className="text-4xl font-bold text-primary">{goalProgress}%</span>
                       </div>
                    </div>

                    <div className="relative">
                        <Progress 
                            value={goalProgress} 
                            className="h-3 bg-secondary" 
                            indicatorColor={getProgressColor(goalProgress)} 
                        />
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                        <p className="text-xs text-muted-foreground">
                            {goalProgress >= 100 ? "Goal completed! Amazing work! 🎉" : 
                             goalProgress >= 50 ? "You're halfway there! Keep it up. 🚀" : 
                             "Every page counts. You got this! 📖"}
                        </p>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={onEditGoal}
                            className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                        >
                            Edit Target
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pages Read</CardTitle>
                    <BookOpen className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalPages}</div>
                    <p className="text-xs text-muted-foreground">this year</p>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Time Read</CardTitle>
                    <Clock className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatDuration(totalMinutes)}</div>
                    <p className="text-xs text-muted-foreground">this year</p>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Books Finished</CardTitle>
                    <Trophy className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{booksFinished}</div>
                    <p className="text-xs text-muted-foreground">completed</p>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Speed</CardTitle>
                    <Zap className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgSpeed}</div>
                    <p className="text-xs text-muted-foreground">pages / hour</p>
                </CardContent>
            </Card>
        </div>
        </div>
    );
}
