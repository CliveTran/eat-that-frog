import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock } from "lucide-react";

interface Session {
    id: string;
    startTime: string;
    duration: number; // in seconds
    distractions: number;
}

interface SessionTrackerProps {
    sessions: Session[];
}

export function SessionTracker({ sessions }: SessionTrackerProps) {
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        return `${mins}m`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const totalFocusTime = sessions.reduce((acc, session) => acc + session.duration, 0);

    return (
        <Card className="h-[300px] flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Recent Sessions
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    Total today: {Math.floor(totalFocusTime / 60)} mins
                </p>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                    {sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
                            No sessions yet today.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sessions.slice().reverse().map((session) => (
                                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm">
                                    <div className="flex flex-col">
                                        <span className="font-medium">Focus Session</span>
                                        <span className="text-xs text-muted-foreground">{formatDate(session.startTime)}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="block font-medium">{formatDuration(session.duration)}</span>
                                        </div>
                                        {session.distractions > 0 && (
                                            <div className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                                                {session.distractions} dist.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
