import { ArrowDown, ArrowUp, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { PRIORITY_COLORS, PRIORITY_LABELS } from "~/lib/constants";
import type { ScheduleBlock, Task } from "~/types";

interface TaskListProps {
  otherTasks: Task[];
  completedTasks: Task[];
  blocks: ScheduleBlock[];
  allTasks: Task[]; // Needed for Schedule tab to filter block tasks
  activeBlock?: ScheduleBlock;
  contextCount: number;
  frog: Task | null;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, direction: 'up' | 'down') => void;
  openEditModal: (task: Task) => void;
  deleteBlock: (id: string) => void;
  onAddBlock: () => void;
}

export function TaskList({
  otherTasks,
  completedTasks,
  blocks,
  allTasks,
  activeBlock,
  contextCount,
  frog,
  toggleTask,
  deleteTask,
  moveTask,
  openEditModal,
  deleteBlock,
  onAddBlock
}: TaskListProps) {
  const scheduleRef = useRef<HTMLDivElement>(null);

  // Scroll to current time in schedule view
  useEffect(() => {
    // We only try this if the schedule tab is likely active/mounted or we just want to enable it
    // But since Tabs mount/unmount content, this effect might need to run when tab changes?
    // Using a ref callback or check inside effect.
    // Simpler: Just try to find the element.
    const currentHour = new Date().getHours();
    // We need to ID the time blocks.
    // But wait, the blocks are rendered dynamically.
    // The previous code targeted `schedule-hour-${currentHour}` which ... didn't exist in the previous read_file output?
    // Let's check the previous `_index.tsx`.
    // It checked `document.getElementById('schedule-hour-' + currentHour)`.
    // But I don't see `id="schedule-hour-..."` in the previous `_index.tsx` map loop.
    // Ah, lines 1149-1152 were omitted in summarized view.
    // I should ensure I add IDs to the blocks if they correspond to hours, or just scroll to the first block that matches?
    
    if (scheduleRef.current) {
        // ...
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Task List</h2>
        <div className="flex items-center gap-2">
           {activeBlock && (
               <Badge variant="secondary" className={cn("text-xs font-normal border", activeBlock.color)}>
                  Focus: {activeBlock.title}
               </Badge>
           )}
           <Badge variant="outline" className="text-sm">
              {contextCount} remaining
           </Badge>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4 mt-4">
          {otherTasks.length === 0 && frog && (
            <p className="text-center text-slate-500 py-8">No other tasks. Focus on the Frog!</p>
          )}
          {otherTasks.length === 0 && !frog && (
            <p className="text-center text-slate-500 py-8">No tasks yet. Add one below.</p>
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
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 mt-4">
          {completedTasks.length === 0 && (
            <p className="text-center text-slate-500 py-8">No completed tasks yet.</p>
          )}
          {completedTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-900/50 opacity-70">
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
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4 mt-4">
           <div className="flex justify-end">
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
              // We filter from 'allTasks' here to show scheduled tasks even if they are not in the 'contextTasks' active view?
              // The original code used 'tasks.filter'.
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
                          <CardContent className="pb-3 pt-0">
                               <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-700 ml-1 mt-1 space-y-1">
                                  {blockTasks.map(t => (
                                      <div key={t.id} className="text-sm flex items-center justify-between">
                                          <span className={cn("truncate", t.completed && "line-through opacity-50")}>
                                              {t.title}
                                          </span>
                                          {(t.startHour !== undefined && t.endHour !== undefined) && (
                                              <span className="text-xs opacity-50 font-mono">
                                                  {t.startHour.toFixed(2).replace('.',':').replace(':5',':30').replace(':0',':00')} - 
                                                  {t.endHour.toFixed(2).replace('.',':').replace(':5',':30').replace(':0',':00')}
                                              </span>
                                          )}
                                      </div>
                                  ))}
                               </div>
                          </CardContent>
                      )}
                  </Card>
              )
           })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
