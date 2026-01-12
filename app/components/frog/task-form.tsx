import { Info, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { PRIORITY_LABELS } from "~/lib/constants";
import type { Priority, ScheduleBlock, Task } from "~/types";

interface TaskFormProps {
  onAddTask: (task: Omit<Task, "id" | "createdAt" | "completed">) => void;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("A");
  const [isRecurring, setIsRecurring] = useState(false);
  const [duration, setDuration] = useState("0.5");

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      priority,
      isRecurring,
      estimatedHours: duration ? parseFloat(duration) : undefined,
      // order and id will be handled by parent
      order: 0, 
    });

    setTitle("");
    setPriority("A");
    setIsRecurring(false);
    setDuration("0.5");
  };


  return (
    <div className="space-y-6 lg:sticky lg:top-8 h-fit">
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
          <CardDescription>Categorize by ABCDE method</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input 
                id="title" 
                placeholder="What needs to be done?" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Est. Duration (Hours)</Label>
              <Input 
                id="duration" 
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 1.5" 
                value={duration}
                onChange={handleDurationChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="A">A - Must do (Frog)</SelectItem>
                    <SelectItem value="B">B - Should do</SelectItem>
                    <SelectItem value="C">C - Nice to do</SelectItem>
                    <SelectItem value="D">D - Delegate</SelectItem>
                    <SelectItem value="E">E - Eliminate</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                {PRIORITY_LABELS[priority]}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="recurring" 
                checked={isRecurring}
                onCheckedChange={(c) => setIsRecurring(!!c)}
              />
              <Label htmlFor="recurring" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Recurring Task (Daily)
              </Label>
            </div>

            <Button type="submit" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-blue-800 dark:text-blue-300">
            <Info className="h-4 w-4" /> Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-blue-700 dark:text-blue-400 space-y-2">
          <p><strong>Rule of 3:</strong> Focus on your top 3 tasks.</p>
          <p><strong>80/20 Rule:</strong> 20% of tasks give 80% of results.</p>
          <p><strong>Single Handle:</strong> Finish one task before starting another.</p>
        </CardContent>
      </Card>
    </div>
  );
}
