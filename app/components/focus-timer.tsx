import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Play, Pause, Square, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface FocusTimerProps {
    onSessionComplete: (duration: number) => void;
}

export function FocusTimer({ onSessionComplete }: FocusTimerProps) {
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(25 * 60);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isEditing, setIsEditing] = useState(false);
    const [editMinutes, setEditMinutes] = useState("25");
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive && !isPaused && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(timerRef.current!);
            setIsActive(false);
            onSessionComplete(duration);
            setTimeLeft(duration);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, isPaused, timeLeft, duration, onSessionComplete]);

    const toggleTimer = () => {
        if (!isActive) {
            setIsActive(true);
            setIsPaused(false);
            setIsEditing(false); // Ensure editing is closed
        } else {
            setIsPaused(!isPaused);
        }
    };

    const stopTimer = () => {
        setIsActive(false);
        setIsPaused(false);
        setTimeLeft(duration);
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsPaused(false);
        setTimeLeft(duration);
    }

    const handleDurationChange = () => {
        const mins = parseInt(editMinutes);
        if (!isNaN(mins) && mins > 0) {
            const newDuration = mins * 60;
            setDuration(newDuration);
            setTimeLeft(newDuration);
            setIsEditing(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = ((duration - timeLeft) / duration) * 100;

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg border-primary/20 relative">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-bold text-primary">Focus Timer</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
                <div className="relative flex items-center justify-center w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-muted">
                    {!isEditing ? (
                        <div
                            className="text-4xl md:text-6xl font-mono font-bold tracking-wider text-foreground cursor-pointer hover:bg-muted/50 rounded px-2"
                            onClick={() => !isActive && setIsEditing(true)}
                            title={!isActive ? "Click to edit duration" : undefined}
                        >
                            {formatTime(timeLeft)}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    className="text-4xl md:text-6xl font-mono font-bold tracking-wider text-foreground bg-transparent w-24 md:w-32 text-center border-b-2 border-primary focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    value={editMinutes}
                                    onChange={(e) => setEditMinutes(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => e.key === "Enter" && handleDurationChange()}
                                />
                                <span className="text-xl text-muted-foreground font-medium">min</span>
                            </div>
                            <Button size="sm" onClick={handleDurationChange}>Set</Button>
                        </div>
                    )}
                </div>

                <Progress value={progress} className="w-full h-3" />

                <div className="flex items-center gap-4">
                    <Button
                        variant={isActive && !isPaused ? "secondary" : "default"}
                        size="lg"
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full"
                        onClick={toggleTimer}
                    >
                        {isActive && !isPaused ? (
                            <Pause className="w-6 h-6 md:w-8 md:h-8" />
                        ) : (
                            <Play className="w-6 h-6 md:w-8 md:h-8 ml-1" />
                        )}
                    </Button>

                    {(isActive || isPaused) && (
                        <Button
                            variant="destructive"
                            size="lg"
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                            onClick={stopTimer}
                        >
                            <Square className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-4 right-4 rounded-full"
                        onClick={resetTimer}
                        title="Reset"
                    >
                        <RefreshCcw className="w-4 h-4" />
                    </Button>

                </div>
                <p className="text-xs md:text-sm text-muted-foreground">
                    {isActive ? (isPaused ? "Paused" : "Focusing...") : (isEditing ? "Set duration" : "Click time to edit")}
                </p>
            </CardContent>
        </Card>
    );
}
