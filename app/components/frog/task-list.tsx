import { ArrowDown, ArrowUp, Clock, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { cn, getMinutes } from "~/lib/utils";
import { PRIORITY_COLORS, PRIORITY_LABELS } from "~/lib/constants";
import type { ScheduleBlock, Task } from "~/types";

import { ScrollArea } from "~/components/ui/scroll-area";

const formatDecimalHour = (decimalHour: number) => {
  const hours = Math.floor(decimalHour);
  const minutes = Math.round((decimalHour - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

interface TaskListProps {
  mode: "priority" | "schedule";
  otherTasks: Task[];
  completedTasks: Task[];
  blocks: ScheduleBlock[];
  allTasks: Task[]; 
  frog: Task | null;
  activeBlock?: ScheduleBlock;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, direction: 'up' | 'down') => void;
  openEditModal: (task: Task) => void;
  deleteBlock: (id: string) => void;
  onAddBlock: () => void;
  unassignTaskFromBlock: (id: string) => void;
}

export function TaskList({
  mode,
  otherTasks,
  completedTasks,
  blocks,
  allTasks,
  frog,
  activeBlock,
  toggleTask,
  deleteTask,
  moveTask,
  openEditModal,
  deleteBlock,
  onAddBlock,
  unassignTaskFromBlock
}: TaskListProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentTimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run timer if we are in schedule mode to save resources, 
    // BUT hooks must be consistent. 
    // So we run it always, or we risk hook mismatch if mode changes (it shouldn't in this app structure usually, but good practice).
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    setCurrentTime(new Date());
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
     if (mode === "schedule" && blocks.length > 0 && currentTimeRef.current) {
         // Small timeout to ensure rendering
         setTimeout(() => {
             currentTimeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
         }, 100);
     }
  }, [mode, blocks.length]);

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // RENDER: PRIORITY LIST (ABCDE)
  if (mode === "priority") {
    // Sort tasks strictly by priority
    // We already have 'frog' extracted. 
    // 'otherTasks' contains everything else sorted by priority.
    // We should display them grouped.
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Priority List</h2>
        
        {/* Active Tasks Grouped */}
        <div className="space-y-4">
             {otherTasks.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500">
                    <p className="font-medium">No additional tasks</p>
                    {frog ? (
                      <p className="text-sm mt-1 text-slate-400">All clear! Focus on eating that frog.</p>
                    ) : (
                      <p className="text-sm mt-1 text-slate-400">Add a task to get started.</p>
                    )}
                </div>
             )}

             {otherTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                  <Checkbox 
                    checked={task.completed} 
                    onCheckedChange={() => toggleTask(task.id)}
                    className="h-5 w-5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={cn("text-xs font-bold", PRIORITY_COLORS[task.priority])}>
                        {task.priority}
                      </Badge>
                      <span className="font-medium truncate">{task.title}</span>
                      {task.isRecurring && <RefreshCw className="h-3 w-3 text-blue-500" />}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{PRIORITY_LABELS[task.priority]}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveTask(task.id, 'up')}>
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveTask(task.id, 'down')}>
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => openEditModal(task)} className="text-slate-400 hover:text-blue-500">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
            ))}
        </div>

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
            <div className="pt-8 opacity-70">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Completed</h3>
                <div className="space-y-2">
                    {completedTasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-900/50">
                        <Checkbox 
                            checked={task.completed} 
                            onCheckedChange={() => toggleTask(task.id)}
                            className="h-5 w-5"
                        />
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                            <span className="font-medium line-through text-slate-500">{task.title}</span>
                            {task.isRecurring && <RefreshCw className="h-3 w-3 text-blue-500" />}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    );
  }

  // RENDER: SCHEDULE LIST
  if (mode === "schedule") {
    return (
        <div className="space-y-4 pt-4">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Daily Schedule</h2>
              <Button size="sm" variant="outline" onClick={onAddBlock}>
                  <Plus className="mr-2 h-4 w-4" /> Add Daily block
              </Button>
           </div>

           {blocks.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg text-slate-500">
                  No time blocks set. Create one to organize your day!
              </div>
           )}

           <ScrollArea className="h-[600px] border rounded-md p-4 bg-slate-50/50 dark:bg-slate-900/50">
             <div className="relative min-h-[1728px]">
                {/* Current Time Indicator */}
                <div 
                    ref={currentTimeRef}
                    className="absolute w-full border-t-2 border-red-500 z-50 flex items-center pointer-events-none"
                    style={{ top: `${currentMinutes * 1.2}px` }}
                >
                    <div className="absolute -left-1.5 w-3 h-3 bg-red-500 rounded-full shadow-sm" />
                </div>

                {/* Time Grid Lines (00:00 - 23:00) 1.2px per minute */}
                {Array.from({ length: 24 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute w-full flex items-center group" 
                        style={{ top: `${i * 60 * 1.2}px` }}
                    >
                        <span className="w-10 text-[10px] text-muted-foreground text-right pr-2 -mt-2 group-hover:text-foreground transition-colors">
                            {i.toString().padStart(2, '0')}:00
                        </span>
                        <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
                    </div>
                ))}
            
                {blocks.map(block => {
                    const blockTasks = allTasks.filter(t => t.blockId === block.id && !t.completed);
                    
                    const startMinutes = getMinutes(block.startTime);
                    let endMinutes = getMinutes(block.endTime);
                    if (endMinutes < startMinutes) endMinutes += 24 * 60; // Handle Next Day
                    
                    const durationMinutes = endMinutes - startMinutes;
                    const height = Math.max(40, durationMinutes * 1.2); 
                    const isActive = activeBlock?.id === block.id;

                    return (
                        <Card 
                            key={block.id} 
                            className={cn(
                                "absolute border-l-4 overflow-hidden shadow-sm hover:shadow-md transition-all inset-x-0 ml-12 mr-1", 
                                block.color,
                                isActive && "ring-2 ring-primary ring-offset-2 z-20"
                            )} 
                            style={{ 
                                top: `${startMinutes * 1.2}px`,
                                height: `${height}px`,
                                zIndex: isActive ? 20 : 10
                            }}
                        >
                            <CardHeader className="py-2 px-3 flex flex-row items-center justify-between space-y-0 h-full">
                                <div className="flex flex-col min-w-0 pr-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-semibold truncate">{block.title}</h3>
                                        <span className="text-[10px] bg-white/50 dark:bg-black/20 px-1 rounded truncate opacity-70">
                                            {block.startTime}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground flex gap-1 mt-0.5">
                                        {blockTasks.length > 0 ? (
                                           <span>{blockTasks.length} task{blockTasks.length !== 1 && 's'}</span>
                                        ) : (
                                           <span className="italic opacity-50">Empty</span>
                                        )}
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteBlock(block.id)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </CardHeader>
                        </Card>
                    )
                })}
             </div>
           </ScrollArea>
        </div>
    );
  }

  return null;
}
