import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, Zap, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

export interface Distraction {
    id: string;
    text: string;
    timestamp: string;
}

interface DistractionLoggerProps {
    onLogDistraction: (note: string) => void;
    distractionHistory: Distraction[];
    disabled?: boolean;
}

export function DistractionLogger({ onLogDistraction, distractionHistory, disabled }: DistractionLoggerProps) {
    const [note, setNote] = useState("");

    const handleLog = () => {
        onLogDistraction(note);
        setNote("");
    };

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Card className="flex flex-col h-full bg-muted/20">
            <CardHeader className="pb-3">
                <CardTitle className="text-md flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    Distraction Log
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col min-h-0">
                <div className="flex gap-2">
                    <Input
                        placeholder="I got distracted by..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        disabled={disabled}
                        className="h-9 bg-background"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && note.trim()) {
                                handleLog();
                            }
                        }}
                    />
                    <Button
                        size="sm"
                        onClick={handleLog}
                        disabled={disabled || !note.trim()}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex-1 overflow-hidden border rounded-md bg-background/50">
                    <ScrollArea className="h-48 sm:h-64 p-3">
                        {distractionHistory.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground/60 text-xs py-10">
                                <History className="h-8 w-8 mb-2 opacity-20" />
                                No distractions recorded.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {distractionHistory.slice().reverse().map((d) => (
                                    <div key={d.id} className="text-sm flex justify-between items-start gap-2 p-2 rounded bg-background border shadow-sm">
                                        <span className="flex-1 break-words">{d.text}</span>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">
                                            {formatTime(d.timestamp)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
}
