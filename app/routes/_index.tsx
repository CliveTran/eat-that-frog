import { useEffect, useState } from "react";
import type { Route } from "./+types/_index";
import type { Task, DailyStats, ScheduleBlock, Priority } from "~/types";
import { getMinutes, sortTasks } from "~/lib/utils";
import { useTaskTimer } from "~/hooks/use-task-timer";

// Components
import { AddBlockDialog } from "~/components/frog/add-block-dialog";
import { EditTaskDialog } from "~/components/frog/edit-task-dialog";
import { FinishTaskDialog } from "~/components/frog/finish-task-dialog";
import { FrogCard } from "~/components/frog/frog-card";
import { StatsHeatmap } from "~/components/frog/stats-heatmap";
import { TaskForm } from "~/components/frog/task-form";
import { TaskList } from "~/components/frog/task-list";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Leap - Focus & Goals" },
    { name: "description", content: "Stop Procrastinating and Get More Done" },
  ];
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Timer for current time highlight
  const [currentTime, setCurrentTime] = useState(new Date());

  // Dialog States
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [lastCreatedBlockId, setLastCreatedBlockId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Persistence
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
          }).filter(t => t.isRecurring || !t.completed); 
          
          localStorage.setItem("eat-that-frog-last-visit", today);
        }
        
        setTasks(loadedTasks);
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    } else {
      localStorage.setItem("eat-that-frog-last-visit", today);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const savedBlocks = localStorage.getItem("eat-that-frog-blocks");
    if (savedBlocks) setBlocks(JSON.parse(savedBlocks));
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("eat-that-frog-tasks", JSON.stringify(tasks));
      localStorage.setItem("eat-that-frog-stats", JSON.stringify(dailyStats));
      localStorage.setItem("eat-that-frog-blocks", JSON.stringify(blocks));
    }
  }, [tasks, dailyStats, blocks, isLoaded]);


  // Logic
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

  const finalizeTaskCompletion = (taskId: string, success: boolean, reason?: string) => {
    if (success) {
        // Frog Check
        const activeTasks = tasks.filter(t => !t.completed);
        const sortedActive = sortTasks(activeTasks);
        const isFrog = sortedActive.length > 0 && sortedActive[0].id === taskId;

        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
        updateDailyStats(isFrog);
    } else {
        if (!reason?.trim()) return; // Should be handled by dialog validation but safe to keep
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, failureReason: reason } : t));
    }
  };

  const {
      activeTaskId,
      timerSeconds,
      startTask,
      stopTask,
      handleTaskComplete,
      showCompletionDialog,
      setShowCompletionDialog,
      failureReason,
      setFailureReason
  } = useTaskTimer(tasks, updateDailyStats, finalizeTaskCompletion);

  // Task Actions
  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAddTask = (taskData: Omit<Task, "id" | "createdAt" | "completed">) => {
    // Find max order for this priority
    const maxOrder = tasks
      .filter(t => t.priority === taskData.priority)
      .reduce((max, t) => Math.max(max, t.order || 0), 0);
    
    const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: Date.now(),
        order: maxOrder + 1
    };
    setTasks([...tasks, newTask]);
  };

  const handleSaveEditedTask = (updatedTask: Task) => {
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      setEditingTask(null);
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

  // Block Actions
  const handleAddBlock = (block: ScheduleBlock) => {
      setBlocks(prev => [...prev, block].sort((a, b) => a.startTime.localeCompare(b.startTime)));
      setLastCreatedBlockId(block.id);
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };


  // Filtering / Derived State
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Time-Block Filter Logic (Context Tasks)
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  
  const activeBlock = blocks.find(b => {
      const start = getMinutes(b.startTime);
      const end = getMinutes(b.endTime);
      return currentMinutes >= start && currentMinutes < end;
  });

  const contextTasks = activeTasks.filter(t => {
      if (activeBlock) {
          return t.blockId === activeBlock.id;
      }
      const taskBlock = blocks.find(b => b.id === t.blockId);
      return !taskBlock;
  });

  const sortedActiveTasks = sortTasks(contextTasks);
  const frog = sortedActiveTasks.length > 0 ? sortedActiveTasks[0] : null;
  const otherTasks = sortedActiveTasks.length > 0 ? sortedActiveTasks.slice(1) : [];

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans">
      
      {/* Dialogs */}
      <FinishTaskDialog 
        open={showCompletionDialog} 
        onOpenChange={setShowCompletionDialog}
        failureReason={failureReason}
        setFailureReason={setFailureReason}
        handleTaskComplete={handleTaskComplete}
      />

      <EditTaskDialog 
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        task={editingTask}
        onSave={handleSaveEditedTask}
        blocks={blocks}
      />

      <AddBlockDialog 
        open={isBlockDialogOpen} 
        onOpenChange={setIsBlockDialogOpen} 
        onBlockAdd={handleAddBlock} 
      />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 dark:text-slate-50">
            Leap 🐸
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            "Leap over procrastination. Tackle your biggest task first."
          </p>
        </header>

        {/* Progress Section */}
        <StatsHeatmap dailyStats={dailyStats} />

        {/* The Frog */}
        {frog && (
            <FrogCard 
                frog={frog}
                activeTaskId={activeTaskId}
                timerSeconds={timerSeconds}
                startTask={startTask}
                stopTask={stopTask}
                openEditModal={setEditingTask}
                deleteTask={deleteTask}
            />
        )}

        {/* Empty State */}
        {!frog && activeTasks.length === 0 && (
          <div className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900 p-6 rounded-lg text-center border">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">All Frogs Eaten!</h3>
              <p className="text-green-600 dark:text-green-400">Great job! You've completed all your tasks.</p>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
          
          {/* Main List */}
          <TaskList 
            otherTasks={otherTasks}
            completedTasks={completedTasks}
            blocks={blocks}
            allTasks={tasks}
            activeBlock={activeBlock}
            contextCount={contextTasks.length}
            frog={frog}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            moveTask={moveTask}
            openEditModal={setEditingTask}
            deleteBlock={deleteBlock}
            onAddBlock={() => setIsBlockDialogOpen(true)}
          />

          {/* Sidebar */}
          <TaskForm 
            blocks={blocks}
            onAddTask={handleAddTask}
            onRequestAddBlock={() => setIsBlockDialogOpen(true)}
            lastCreatedBlockId={lastCreatedBlockId}
          />

        </div>
      </div>
    </div>
  );
}
