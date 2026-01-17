import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { AlertCircle, Pencil, Trash2, Timer, Square, Play, RefreshCw } from "lucide-react";
import { cn, formatTime } from "~/lib/utils";
import { PRIORITY_COLORS, PRIORITY_LABELS } from "~/lib/constants";
import type { Task } from "~/types";

interface FrogCardProps {
  frog: Task;
  activeTaskId: string | null;
  timerSeconds: number;
  startTask: (task: Task) => void;
  stopTask: () => void;
  openEditModal: (task: Task) => void;
  deleteTask: (id: string) => void;
}

export function FrogCard({
  frog,
  activeTaskId,
  timerSeconds,
  startTask,
  stopTask,
  openEditModal,
  deleteTask
}: FrogCardProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <h2 className="text-xl font-semibold tracking-tight">Your Frog (Do this first!)</h2>
      </div>
      <Card className="border-2 border-red-500/50 shadow-lg bg-card relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <span className="text-9xl">🐸</span>
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <Badge className={cn("text-lg px-3 py-1", PRIORITY_COLORS[frog.priority])}>
              Priority {frog.priority}
            </Badge>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => openEditModal(frog)} className="text-slate-400 hover:text-blue-500">
                <Pencil className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteTask(frog.id)} className="text-slate-400 hover:text-red-500">
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <CardTitle className="text-3xl mt-2 flex items-center gap-2">
            {frog.title}
            {frog.isRecurring && <RefreshCw className="h-6 w-6 text-blue-500" />}
          </CardTitle>
          <CardDescription className="text-lg flex flex-col gap-1">
            <span>{PRIORITY_LABELS[frog.priority]}</span>
            {frog.estimatedHours && (
              <span className="flex items-center gap-1 text-sm text-slate-500">
                <Timer className="h-4 w-4" /> Est: {frog.estimatedHours}h
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          {activeTaskId === frog.id ? (
            <div className="w-full space-y-4">
              <div className="text-center py-4 bg-muted rounded-lg">
                <span className="text-4xl font-mono font-bold text-slate-900 dark:text-slate-100">
                  {formatTime(timerSeconds)}
                </span>
              </div>
              <Button
                size="lg"
                variant="destructive"
                className="w-full text-lg h-12"
                onClick={stopTask}
              >
                <Square className="mr-2 h-5 w-5 fill-current" />
                Finish / Stop
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              className="w-full md:w-auto text-lg h-12 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => startTask(frog)}
            >
              <Play className="mr-2 h-6 w-6 fill-current" />
              Eat This Frog!
            </Button>
          )}
        </CardFooter>
      </Card>
    </section>
  );
}
