import { useState, useEffect, useRef } from "react";
import type { Route } from "./+types/_index"; 
import type { ScheduleBlock, Task } from "~/types"; 
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { cn } from "~/lib/utils";

import { getMinutes } from "~/lib/utils";

import { ScrollArea } from "~/components/ui/scroll-area";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Schedule - Leap" },
    { name: "description", content: "Block your day." },
  ];
}

const COLORS = [
  { label: "Blue", value: "bg-blue-100 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800" },
  { label: "Green", value: "bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-800" },
  { label: "Yellow", value: "bg-yellow-100 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-800" },
  { label: "Red", value: "bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-800" },
  { label: "Purple", value: "bg-purple-100 dark:bg-purple-900/50 border-purple-200 dark:border-purple-800" },
  { label: "Gray", value: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" },
];

const START_TIMES = Array.from({ length: 24 }).flatMap((_, i) => [
    `${i.toString().padStart(2, '0')}:00`,
    `${i.toString().padStart(2, '0')}:30`
]);

export default function Schedule() {
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]); // To show subtasks
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date()); // Add current time state
  
  // New Block State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newStart, setNewStart] = useState("09:00");
  const [newEnd, setNewEnd] = useState("17:00");
  const [newColor, setNewColor] = useState(COLORS[0].value);
  const currentTimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedBlocks = localStorage.getItem("eat-that-frog-blocks");
    const savedTasks = localStorage.getItem("eat-that-frog-tasks");
    
    if (savedBlocks) {
      try {
        setBlocks(JSON.parse(savedBlocks));
      } catch (e) { console.error(e); }
    }
    if (savedTasks) {
       try {
        setTasks(JSON.parse(savedTasks));
       } catch (e) { console.error(e); }
    }
    setIsLoaded(true);

    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLoaded && blocks.length > 0 && currentTimeRef.current) {
        setTimeout(() => {
            currentTimeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
    }
  }, [isLoaded, blocks.length]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("eat-that-frog-blocks", JSON.stringify(blocks));
    }
  }, [blocks, isLoaded]);

  const addBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    const newBlock: ScheduleBlock = {
        id: crypto.randomUUID(),
        title: newTitle,
        startTime: newStart,
        endTime: newEnd,
        color: newColor,
    };
    
    setBlocks([...blocks, newBlock].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    setNewTitle("");
    setIsDialogOpen(false);
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  // Helper to convert time "09:30" to pixels
  const timeToPos = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return (h * 60 + m); // minutes from midnight
  };

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-slate-900 dark:text-slate-100" />
            <h1 className="text-3xl font-bold tracking-tight">Daily Schedule</h1>
         </div>
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Daily Block
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Daily Block</DialogTitle>
                    <DialogDescription>Create a time block that repeats every day.</DialogDescription>
                </DialogHeader>
                <form onSubmit={addBlock} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Block Name</Label>
                        <Input placeholder="e.g. Deep Work" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Select value={newStart} onValueChange={setNewStart}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {START_TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>End Time</Label>
                            <Select value={newEnd} onValueChange={setNewEnd}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {START_TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map(c => (
                                <div 
                                    key={c.label} 
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 cursor-pointer transition-all", 
                                        c.value.split(" ")[0], // Get just the bg class
                                        newColor === c.value ? "ring-2 ring-offset-2 ring-black dark:ring-white scale-110" : "border-transparent"
                                    )}
                                    onClick={() => setNewColor(c.value)}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create Block</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
         </Dialog>
      </div>
      
      <ScrollArea className="h-[calc(100vh-200px)] rounded-md border p-4">
        {blocks.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                No time blocks set. Create one to organize your day!
            </div>
        ) : (
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
                        <span className="w-12 text-xs text-muted-foreground text-right pr-3 -mt-2 group-hover:text-foreground transition-colors">
                            {i.toString().padStart(2, '0')}:00
                        </span>
                        <div className="flex-1 border-t border-slate-100 dark:border-slate-800" />
                    </div>
                ))}

                {blocks.map(block => {
                    const blockTasks = tasks.filter(t => t.blockId === block.id && !t.completed);
                    
                    const startMinutes = getMinutes(block.startTime);
                    let endMinutes = getMinutes(block.endTime);
                    if (endMinutes < startMinutes) endMinutes += 24 * 60;
                    
                    const durationMinutes = endMinutes - startMinutes;
                    const height = Math.max(40, durationMinutes * 1.2); // Min height 40px for visibility

                    return (
                        <Card 
                            key={block.id} 
                            className={cn("absolute border-l-4 overflow-hidden shadow-sm hover:shadow-md transition-all inset-x-0 ml-16 mr-2", block.color)} 
                            style={{ 
                                top: `${startMinutes * 1.2}px`,
                                height: `${height}px`,
                                zIndex: 10
                            }}
                        >
                            <CardHeader className="py-2 px-3 flex flex-row items-start justify-between space-y-0 h-full">
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CardTitle className="text-sm font-semibold truncate leading-tight">{block.title}</CardTitle>
                                        <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground/80 opacity-70">
                                            {block.startTime} - {block.endTime}
                                        </span>
                                    </div>
                                    
                                    {blockTasks.length > 0 && (
                                        <div className="flex flex-col gap-0.5 overflow-hidden">
                                            {blockTasks.slice(0, 3).map(task => (
                                                <div key={task.id} className="text-[10px] flex items-center gap-1.5 text-muted-foreground truncate">
                                                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${task.priority === 'A' ? 'bg-red-500' : 'bg-slate-300'}`} />
                                                    <span className="truncate">{task.title}</span>
                                                </div>
                                            ))}
                                            {blockTasks.length > 3 && (
                                                <span className="text-[9px] text-muted-foreground pl-2.5">+{blockTasks.length - 3} more</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1 -mt-1 text-muted-foreground hover:text-red-500 flex-shrink-0" onClick={() => deleteBlock(block.id)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </CardHeader>
                        </Card>
                    )
                })}
            </div>
        )}
      </ScrollArea>
    </div>
  );
}

