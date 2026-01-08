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
  
  // New Block State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newStart, setNewStart] = useState("09:00");
  const [newEnd, setNewEnd] = useState("17:00");
  const [newColor, setNewColor] = useState(COLORS[0].value);

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
  }, []);

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
                    <Plus className="mr-2 h-4 w-4" /> Add Time Block
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Schedule Block</DialogTitle>
                    <DialogDescription>Define a high-level time block (e.g., Work, Gym, Study).</DialogDescription>
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
      
      <div className="grid gap-4">
        {blocks.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                No time blocks set. Create one to organize your day!
            </div>
        )}
        
        {blocks.map(block => {
            const blockTasks = tasks.filter(t => t.blockId === block.id && !t.completed);
            
            return (
                <Card key={block.id} className={cn("overflow-hidden border-l-4", block.color)}>
                    <CardHeader className="py-3 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-4">
                             <div className="flex flex-col">
                                <span className="text-xs font-mono text-muted-foreground">{block.startTime} - {block.endTime}</span>
                                <CardTitle className="text-lg">{block.title}</CardTitle>
                             </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => deleteBlock(block.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    {blockTasks.length > 0 && (
                        <CardContent className="pb-3 pt-0">
                             <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-700 ml-1 mt-1 space-y-1">
                                {blockTasks.map(task => (
                                    <div key={task.id} className="text-sm flex items-center gap-2 text-muted-foreground">
                                        <div className={`w-2 h-2 rounded-full ${task.priority === 'A' ? 'bg-red-500' : 'bg-slate-300'}`} />
                                        <span>{task.title}</span>
                                    </div>
                                ))}
                             </div>
                        </CardContent>
                    )}
                </Card>
            )
        })}
      </div>
    </div>
  );
}

