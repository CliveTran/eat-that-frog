import { ArrowDown, ArrowUp, Clock, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { cn } from "~/lib/utils";
import { PRIORITY_COLORS, PRIORITY_LABELS } from "~/lib/constants";
import type { ScheduleBlock, Task } from "~/types";

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
  toggleTask,
  deleteTask,
  moveTask,
  openEditModal,
  deleteBlock,
  onAddBlock,
  unassignTaskFromBlock
}: TaskListProps) {

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
                  <Plus className="mr-2 h-4 w-4" /> Add Time Block
              </Button>
           </div>

           {blocks.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg text-slate-500">
                  No time blocks set. Create one to organize your day!
              </div>
           )}

           {blocks.map(block => {
              const blockTasks = allTasks.filter(t => t.blockId === block.id && !t.completed);
              return (
                  <Card key={block.id} className={cn("overflow-hidden border-l-4", block.color)}>
                      <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0">
                          <div className="flex items-center gap-4">
                               <div className="bg-white/50 dark:bg-black/20 px-2 py-1 rounded text-sm font-bold">
                                  {block.startTime} - {block.endTime}
                               </div>
                               <h3 className="font-semibold">{block.title}</h3>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => deleteBlock(block.id)}>
                              <Trash2 className="h-4 w-4" />
                          </Button>
                      </CardHeader>
                      {blockTasks.length > 0 && (
                          <CardContent className="pb-4 pt-1 px-4">
                               <div className="space-y-2">
                                  {blockTasks.map(t => (
                                      <div key={t.id} className="group relative bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-md p-2.5 hover:shadow-sm hover:bg-white dark:hover:bg-slate-800 transition-all flex items-start gap-2">
                                          <div className="flex-1 min-w-0">
                                              <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-2 truncate pr-2">
                                                      <Badge variant="outline" className={cn("text-[10px] h-4 px-1 py-0", PRIORITY_COLORS[t.priority])}>{t.priority}</Badge>
                                                      <span className={cn("text-sm font-medium truncate", t.completed && "line-through text-slate-400 decoration-slate-400/50")}>
                                                          {t.title}
                                                      </span>
                                                  </div>
                                                  <Button 
                                                      variant="ghost" 
                                                      size="icon" 
                                                      className="h-6 w-6 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0" 
                                                      onClick={() => unassignTaskFromBlock(t.id)}
                                                      title="Remove from block"
                                                  >
                                                      <X className="h-3.5 w-3.5" />
                                                  </Button>
                                              </div>
                                              
                                              {(t.startHour !== undefined && t.endHour !== undefined) && (
                                                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                                                      <Clock className="w-3 h-3 text-slate-400" />
                                                      <span className="font-mono bg-white dark:bg-slate-900 px-1.5 rounded text-[10px] border border-slate-100 dark:border-slate-800">
                                                          {formatDecimalHour(t.startHour)} - {formatDecimalHour(t.endHour)}
                                                      </span>
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                  ))}
                               </div>
                          </CardContent>
                      )}
                  </Card>
              )
           })}
        </div>
    );
  }

  return null;
}
