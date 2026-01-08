import { useState, useEffect } from "react";
import type { Route } from "./+types/home";
import type { Task, Priority, DailyStats } from "~/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { Trash2, Plus, CheckCircle2, AlertCircle, Info, RefreshCw, ArrowUp, ArrowDown, Timer, Play, Square, Flame, Calendar, Pencil } from "lucide-react";
import { cn } from "~/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Eat That Frog! - Todo App" },
    { name: "description", content: "Stop Procrastinating and Get More Done" },
  ];
}

const PRIORITY_LABELS: Record<Priority, string> = {
  A: "Must do (Serious consequences)",
  B: "Should do (Minor consequences)",
  C: "Nice to do (No consequences)",
  D: "Delegate",
  E: "Eliminate",
};

const PRIORITY_COLORS: Record<Priority, string> = {
  A: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  B: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  C: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  D: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  E: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
};

const TIME_OPTIONS = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return {
    value: (i / 2).toString(),
    label: `${hour.toString().padStart(2, '0')}:${minute}`
  };
});
// Add 24:00 as an end option
TIME_OPTIONS.push({ value: "24", label: "24:00" });

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("A");
  const [newTaskIsRecurring, setNewTaskIsRecurring] = useState(false);
  const [newTaskDuration, setNewTaskDuration] = useState("0.5");
  const [newTaskStartHour, setNewTaskStartHour] = useState<string>("");
  const [newTaskEndHour, setNewTaskEndHour] = useState<string>("");
  const [newTaskEndsNextDay, setNewTaskEndsNextDay] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Timer for current time highlight
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Edit State
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<Priority>("A");
  const [editIsRecurring, setEditIsRecurring] = useState(false);
  const [editDuration, setEditDuration] = useState("");
  const [editStartHour, setEditStartHour] = useState<string>("");
  const [editEndHour, setEditEndHour] = useState<string>("");
  const [editEndsNextDay, setEditEndsNextDay] = useState(false);

  useEffect(() => {
    if (editingTask && editStartHour && editDuration) {
      const end = calculateEndTime(editStartHour, editDuration);
      if (end) setEditEndHour(end);
    }
  }, [editStartHour, editDuration, editingTask]);

  useEffect(() => {
    if (newTaskStartHour && newTaskDuration) {
      const end = calculateEndTime(newTaskStartHour, newTaskDuration);
      if (end) setNewTaskEndHour(end);
    }
  }, [newTaskStartHour, newTaskDuration]);

  // Timer State
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [failureReason, setFailureReason] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timerSeconds === 0) {
      setIsTimerRunning(false);
      setShowCompletionDialog(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startTask = (task: Task) => {
    const durationHours = task.estimatedHours || 0.5; // Default to 0.5 hour if not set
    setTimerSeconds(durationHours * 3600);
    setActiveTaskId(task.id);
    setIsTimerRunning(true);
  };

  const stopTask = () => {
    setIsTimerRunning(false);
    setShowCompletionDialog(true);
  };

  const updateDailyStats = (isFrog: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    const existingStatIndex = dailyStats.findIndex(s => s.date === today);
    
    let newStats = [...dailyStats];
    if (existingStatIndex >= 0) {
      newStats[existingStatIndex] = {
        ...newStats[existingStatIndex],
        tasksCompleted: newStats[existingStatIndex].tasksCompleted + 1,
        frogEaten: newStats[existingStatIndex].frogEaten || isFrog
      };
    } else {
      newStats.push({
        date: today,
        tasksCompleted: 1,
        frogEaten: isFrog
      });
    }
    setDailyStats(newStats);
  };

  const handleTaskComplete = (success: boolean) => {
    if (!activeTaskId) return;

    if (success) {
      // Check if it was the frog (Priority A, Order 1 or just first A)
      // We can check if it was the first task in the sorted list of active tasks
      const activeTasks = tasks.filter(t => !t.completed);
      const sortedActive = sortTasks(activeTasks);
      const isFrog = sortedActive.length > 0 && sortedActive[0].id === activeTaskId;

      setTasks(tasks.map(t => t.id === activeTaskId ? { ...t, completed: true } : t));
      updateDailyStats(isFrog);
      
      setShowCompletionDialog(false);
      setActiveTaskId(null);
      setFailureReason("");
    } else {
      // If not success, we need a reason. If reason provided, save it.
      if (!failureReason.trim()) return; // Require reason
      
      setTasks(tasks.map(t => t.id === activeTaskId ? { ...t, failureReason: failureReason } : t));
      setShowCompletionDialog(false);
      setActiveTaskId(null);
      setFailureReason("");
    }
  };

  useEffect(() => {
    const savedTasks = localStorage.getItem("eat-that-frog-tasks");
    const savedStats = localStorage.getItem("eat-that-frog-stats");
    const lastVisit = localStorage.getItem("eat-that-frog-last-visit");
    const today = new Date().toISOString().split('T')[0];

    if (savedStats) {
      try {
        setDailyStats(JSON.parse(savedStats));
      } catch (e) {
        console.error("Failed to load stats", e);
      }
    }

    if (savedTasks) {
      try {
        let loadedTasks: Task[] = JSON.parse(savedTasks);
        
        // Check for new day reset
        if (lastVisit !== today) {
          loadedTasks = loadedTasks.map(t => {
            if (t.isRecurring) {
              return { ...t, completed: false };
            }
            return t;
          }).filter(t => t.isRecurring || !t.completed); // Keep recurring (reset) and active non-recurring. Remove completed non-recurring.
          
          // Update last visit
          localStorage.setItem("eat-that-frog-last-visit", today);
        }
        
        setTasks(loadedTasks);
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    } else {
      // First time visit or no data
      localStorage.setItem("eat-that-frog-last-visit", today);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("eat-that-frog-tasks", JSON.stringify(tasks));
      localStorage.setItem("eat-that-frog-stats", JSON.stringify(dailyStats));
    }
  }, [tasks, dailyStats, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      const currentHour = new Date().getHours();
      const element = document.getElementById(`schedule-hour-${currentHour}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isLoaded]);

  const calculateEndTime = (startStr: string, durationStr: string) => {
    if (!startStr || !durationStr) return { end: "", nextDay: false };
    const start = parseFloat(startStr);
    const duration = parseFloat(durationStr);
    if (isNaN(start) || isNaN(duration)) return { end: "", nextDay: false };

    let end = start + duration;
    let nextDay = false;
    
    if (end >= 24) {
      end = end - 24;
      nextDay = true;
    }
    
    return { end: end.toString(), nextDay };
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditIsRecurring(task.isRecurring || false);
    // Default to 0.5 hours if not set, to match new task behavior
    setEditDuration(task.estimatedHours !== undefined ? task.estimatedHours.toString() : "0.5");
    setEditStartHour(task.startHour !== undefined ? task.startHour.toString() : "");
    setEditEndHour(task.endHour !== undefined ? task.endHour.toString() : "");
    setEditEndsNextDay(task.endsNextDay || false);
  };

  const handleEditDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditDuration(e.target.value);
  };

  const handleEditStartHourChange = (val: string) => {
    setEditStartHour(val);
  }

  const saveEditedTask = () => {
      if (!editingTask || !editTitle.trim()) return;

      const updatedTask: Task = {
          ...editingTask,
          title: editTitle,
          priority: editPriority,
          isRecurring: editIsRecurring,
          estimatedHours: editDuration ? parseFloat(editDuration) : undefined,
          startHour: editStartHour ? parseFloat(editStartHour) : undefined,
          endHour: editEndHour ? parseFloat(editEndHour) : undefined,
          endsNextDay: editEndsNextDay,
      };

      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      setEditingTask(null);
  };

  useEffect(() => {
    if (editingTask && editStartHour && editDuration) {
      const { end } = calculateEndTime(editStartHour, editDuration);
      if (end) {
          setEditEndHour(end);
      }
    }
  }, [editStartHour, editDuration, editingTask]);

  useEffect(() => {
    if (newTaskStartHour && newTaskDuration) {
      const { end } = calculateEndTime(newTaskStartHour, newTaskDuration);
      if (end) {
          setNewTaskEndHour(end);
      }
    }
  }, [newTaskStartHour, newTaskDuration]);

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskDuration(e.target.value);
  };

  const handleStartHourChange = (val: string) => {
    setNewTaskStartHour(val);
  }

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    // Find max order for this priority
    const maxOrder = tasks
      .filter(t => t.priority === newTaskPriority)
      .reduce((max, t) => Math.max(max, t.order || 0), 0);

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      priority: newTaskPriority,
      completed: false,
      isRecurring: newTaskIsRecurring,
      estimatedHours: newTaskDuration ? parseFloat(newTaskDuration) : undefined,
      startHour: newTaskStartHour ? parseFloat(newTaskStartHour) : undefined,
      endHour: newTaskEndHour ? parseFloat(newTaskEndHour) : undefined,
      endsNextDay: newTaskEndsNextDay,
      order: maxOrder + 1,
      createdAt: Date.now(),
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskPriority("A");
    setNewTaskIsRecurring(false);
    setNewTaskDuration("0.5");
    setNewTaskStartHour("");
    setNewTaskEndHour("");
    setNewTaskEndsNextDay(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const moveTask = (id: string, direction: 'up' | 'down') => {
    const taskToMove = tasks.find(t => t.id === id);
    if (!taskToMove) return;

    // Get all tasks with same priority, sorted by order
    const samePriorityTasks = tasks
      .filter(t => t.priority === taskToMove.priority && !t.completed)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    
    const currentIndex = samePriorityTasks.findIndex(t => t.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < samePriorityTasks.length) {
      const targetTask = samePriorityTasks[targetIndex];
      
      // Swap orders
      const newTasks = tasks.map(t => {
        if (t.id === taskToMove.id) return { ...t, order: targetTask.order || 0 };
        if (t.id === targetTask.id) return { ...t, order: taskToMove.order || 0 };
        return t;
      });
      
      setTasks(newTasks);
    }
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Sort: Priority (A->E), then Order, then CreatedAt
  const sortTasks = (taskList: Task[]) => {
    return [...taskList].sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority.localeCompare(b.priority);
      }
      // If order is defined, use it. Fallback to createdAt for backward compatibility
      const orderA = a.order ?? a.createdAt;
      const orderB = b.order ?? b.createdAt;
      return orderA - orderB;
    });
  };

  const sortedActiveTasks = sortTasks(activeTasks);
  const frog = sortedActiveTasks.length > 0 ? sortedActiveTasks[0] : null;
  const otherTasks = sortedActiveTasks.length > 0 ? sortedActiveTasks.slice(1) : [];

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans">
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Did you finish the task?</DialogTitle>
            <DialogDescription>
              Time is up! Did you successfully eat this frog?
            </DialogDescription>
          </DialogHeader>
          
          {!failureReason && (
            <div className="flex justify-end gap-4 py-4">
              <Button variant="outline" onClick={() => setFailureReason(" ")}>No, I didn't</Button>
              <Button onClick={() => handleTaskComplete(true)}>Yes, Finished!</Button>
            </div>
          )}

          {failureReason && (
            <div className="space-y-4 py-4">
              <Label>Why couldn't you finish?</Label>
              <Textarea 
                value={failureReason.trim()} 
                onChange={(e) => setFailureReason(e.target.value)}
                placeholder="I got distracted by..."
              />
              <DialogFooter>
                <Button variant="ghost" onClick={() => setFailureReason("")}>Back</Button>
                <Button onClick={() => handleTaskComplete(false)}>Save & Continue</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                <Label htmlFor="edit-title">Task Title</Label>
                <Input 
                  id="edit-title" 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Est. Duration (Hours)</Label>
                <Input 
                  id="edit-duration" 
                  type="number"
                  step="0.1"
                  min="0"
                  value={editDuration}
                  onChange={handleEditDurationChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-startHour">Start Time</Label>
                  <Select value={editStartHour} onValueChange={handleEditStartHourChange}>
                    <SelectTrigger id="edit-startHour">
                      <SelectValue placeholder="Start" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.filter(o => o.value !== "24").map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                   <Label htmlFor="edit-endHour">End Time</Label>
                   <Select value={editEndHour} onValueChange={setEditEndHour}>
                    <SelectTrigger id="edit-endHour">
                      <SelectValue placeholder="End" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                   </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                    id="edit-next-day"
                    checked={editEndsNextDay}
                    onCheckedChange={(c) => setEditEndsNextDay(!!c)}
                />
                <Label htmlFor="edit-next-day">Ends Next Day</Label>
              </div>
              {editStartHour && editEndHour && !editEndsNextDay && parseFloat(editEndHour) <= parseFloat(editStartHour) && (
                  <p className="text-xs text-red-500">End time must be after start time</p>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select value={editPriority} onValueChange={(v) => setEditPriority(v as Priority)}>
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
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="edit-recurring" 
                  checked={editIsRecurring}
                  onCheckedChange={(c) => setEditIsRecurring(!!c)}
                />
                <Label htmlFor="edit-recurring">
                  Recurring Task (Daily)
                </Label>
              </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
            <Button onClick={saveEditedTask}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 dark:text-slate-50">
            Eat That Frog! 🐸
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            "If it's your job to eat a frog, it's best to do it first thing in the morning."
          </p>
        </header>

        {/* Progress Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-semibold tracking-tight">Daily Progress ({new Date().getFullYear()})</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                <span>Frog Eaten</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/50"></div>
                <span>Tasks Done</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-red-200 dark:bg-red-900/50"></div>
                <span>No Activity</span>
              </div>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, monthIndex) => {
                  const currentYear = new Date().getFullYear();
                  const date = new Date(Date.UTC(currentYear, monthIndex, 1));
                  const monthName = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
                  const daysInMonth = new Date(Date.UTC(currentYear, monthIndex + 1, 0)).getUTCDate();

                  return (
                    <div key={monthIndex} className="space-y-2">
                      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">{monthName}</h3>
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                          const dayDate = new Date(Date.UTC(currentYear, monthIndex, dayIndex + 1));
                          const dateStr = dayDate.toISOString().split('T')[0];
                          const todayStr = new Date().toISOString().split('T')[0];
                          const stat = dailyStats.find(s => s.date === dateStr);
                          const isFuture = dateStr > todayStr;
                          
                          let bgClass = "bg-slate-100 dark:bg-slate-800";
                          
                          if (!isFuture) {
                            if (stat?.frogEaten) {
                              bgClass = "bg-green-500";
                            } else if (stat && stat.tasksCompleted > 0) {
                              bgClass = "bg-green-200 dark:bg-green-900/50";
                            } else {
                              bgClass = "bg-red-200 dark:bg-red-900/50";
                            }
                          }

                          return (
                            <TooltipProvider key={dayIndex}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div 
                                    className={cn("w-3 h-3 rounded-sm transition-colors", bgClass)}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="font-bold">{dayDate.toLocaleDateString(undefined, { timeZone: 'UTC' })}</p>
                                  {isFuture ? (
                                    <p>Future</p>
                                  ) : (
                                    <>
                                      <p>{stat ? `${stat.tasksCompleted} tasks completed` : "No activity"}</p>
                                      {stat?.frogEaten && <p className="text-green-500 font-bold">🐸 Frog Eaten!</p>}
                                    </>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* The Frog */}
        {frog && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-semibold tracking-tight">Your Frog (Do this first!)</h2>
            </div>
            <Card className="border-2 border-red-500/50 shadow-lg bg-white dark:bg-slate-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="text-9xl">🐸</span>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge className={cn("text-lg px-3 py-1", PRIORITY_COLORS[frog.priority])}>
                    Priority {frog.priority}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => openEditModal(frog)} className="text-slate-400 hover:text-blue-500">
                    <Pencil className="h-5 w-5" />
                  </Button>
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
                    <div className="text-center py-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
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
        )}

        {!frog && activeTasks.length === 0 && (
          <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
            <CardContent className="pt-6 text-center space-y-2">
              <div className="text-4xl">🎉</div>
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">All Frogs Eaten!</h3>
              <p className="text-green-600 dark:text-green-400">Great job! You've completed all your tasks.</p>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-[1fr_350px] gap-8">
          
          {/* Main List */}
          <div className="space-y-6">
            
            {/* Daily Schedule */}
            <Card>
              <CardHeader className="pb-3 border-b dark:border-slate-800">
                 <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-slate-500" /> 
                    Daily Schedule
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-64 overflow-y-auto custom-scrollbar pr-2">
                  {TIME_OPTIONS.filter(o => o.value !== "24").map((option) => {
                    const timeValue = parseFloat(option.value);
                    const tasksAtTime = activeTasks.filter(t => {
                        if (t.startHour === undefined || t.endHour === undefined) return false;
                        
                        if (t.endsNextDay) {
                             // Case: 9pm (21) to 8am (8)
                             // Active if time >= 21 OR time < 8
                             return timeValue >= t.startHour || timeValue < t.endHour;
                        } else {
                            // Case: 9am (9) to 11am (11)
                            // Active if 9 <= time < 11
                            return t.startHour <= timeValue && t.endHour > timeValue; 
                        }
                    });
                    
                    const currentHourFloat = currentTime.getHours() + currentTime.getMinutes() / 60;
                    const isCurrentSlot = currentHourFloat >= timeValue && currentHourFloat < timeValue + 0.5;

                    return (
                        <div key={option.value} id={`schedule-hour-${Math.floor(timeValue)}`} 
                            className={cn(
                                "flex border-b last:border-0 dark:border-slate-800 transition-colors duration-500", 
                                option.value.endsWith('.5') ? "bg-slate-50/50 dark:bg-slate-900/20" : "",
                                isCurrentSlot ? "bg-blue-100 dark:bg-blue-900/30 border-l-4 border-l-blue-500" : ""
                            )}>
                            <div className={cn(
                                "w-16 py-2 pr-4 text-xs font-mono text-right text-slate-500 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-end",
                                isCurrentSlot ? "text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20" : ""
                            )}>
                                {option.label}
                            </div>
                            <div className="flex-1 p-1 min-h-[36px] relative hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                {tasksAtTime.map(task => (
                                    <div key={task.id} className={cn("text-xs rounded px-2 py-1 mb-1 shadow-sm border truncate", PRIORITY_COLORS[task.priority])}>
                                        <span className="font-bold mr-1 opacity-75">[{task.priority}]</span>
                                        {task.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Task List</h2>
              <Badge variant="outline" className="text-sm">
                {activeTasks.length} remaining
              </Badge>
            </div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
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
            </Tabs>
          </div>

          {/* Sidebar / Add Task */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Task</CardTitle>
                <CardDescription>Categorize by ABCDE method</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={addTask} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input 
                      id="title" 
                      placeholder="What needs to be done?" 
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
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
                      value={newTaskDuration}
                      onChange={handleDurationChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="startHour">Start Time</Label>
                      <Select value={newTaskStartHour} onValueChange={handleStartHourChange}>
                        <SelectTrigger id="startHour">
                          <SelectValue placeholder="Start" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.filter(o => o.value !== "24").map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="endHour">End Time</Label>
                       <Select value={newTaskEndHour} onValueChange={setNewTaskEndHour}>
                        <SelectTrigger id="endHour">
                          <SelectValue placeholder="End" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                       </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                        id="new-next-day"
                        checked={newTaskEndsNextDay}
                        onCheckedChange={(c) => setNewTaskEndsNextDay(!!c)}
                    />
                    <Label htmlFor="new-next-day">Ends Next Day</Label>
                  </div>
                  {newTaskStartHour && newTaskEndHour && !newTaskEndsNextDay && parseFloat(newTaskEndHour) <= parseFloat(newTaskStartHour) && (
                      <p className="text-xs text-red-500">End time must be after start time</p>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTaskPriority} onValueChange={(v) => setNewTaskPriority(v as Priority)}>
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
                      {PRIORITY_LABELS[newTaskPriority]}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="recurring" 
                      checked={newTaskIsRecurring}
                      onCheckedChange={(c) => setNewTaskIsRecurring(!!c)}
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

        </div>
      </div>
    </div>
  );
}
