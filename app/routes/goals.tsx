import { useState, useEffect } from "react";
import type { Route } from "./+types/goals";
import type { Goal, GoalCategory, GoalStep, Priority, StepStatus } from "~/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { Progress } from "~/components/ui/progress";
import { Target, Trophy, Plus, Trash2, Pencil, Calendar, CheckCircle2, TrendingUp, MoreHorizontal, Circle, Clock } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Goals - Leap" },
  ];
}

const CATEGORY_COLORS: Record<GoalCategory, string> = {
  Career: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Health: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Finance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Personal: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Education: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  Other: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
};

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Add Goal State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState<GoalCategory>("Personal");
  const [newYear, setNewYear] = useState(new Date().getFullYear().toString());
  
  // Edit Goal State
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState<GoalCategory>("Personal");
  const [editYear, setEditYear] = useState("");

  // Load Data
  useEffect(() => {
    const savedGoals = localStorage.getItem("eat-that-frog-goals");
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (e) {
        console.error("Failed to load goals", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save Data
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("eat-that-frog-goals", JSON.stringify(goals));
    }
  }, [goals, isLoaded]);

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const goal: Goal = {
      id: crypto.randomUUID(),
      title: newTitle,
      description: newDescription,
      category: newCategory,
      year: parseInt(newYear) || new Date().getFullYear(),
      status: 'Not Started',
      progress: 0,
      steps: [],
      createdAt: Date.now(),
    };

    setGoals([goal, ...goals]);
    setNewTitle("");
    setNewDescription("");
    setNewCategory("Personal");
    setIsAddDialogOpen(false);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setEditTitle(goal.title);
    setEditDescription(goal.description || "");
    setEditCategory(goal.category);
    setEditYear(goal.year.toString());
  };

  const saveEditedGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || !editTitle.trim()) return;

    setGoals(goals.map(g => {
        if (g.id === editingGoal.id) {
            return {
                ...g,
                title: editTitle,
                description: editDescription,
                category: editCategory,
                year: parseInt(editYear) || new Date().getFullYear(),
            };
        }
        return g;
    }));
    setEditingGoal(null);
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const updateGoalStatus = (goal: Goal) => {
    // Auto-calculate status based on progress and steps
    const totalSteps = goal.steps.length;
    
    // Weight: Completed = 1, In Progress = 0.5
    const totalScore = goal.steps.reduce((acc, step) => {
        if (step.status === 'Completed' || step.completed) return acc + 1;
        if (step.status === 'In Progress') return acc + 0.5;
        return acc;
    }, 0);
    
    let newProgress = goal.progress;
    let newStatus = goal.status;

    if (totalSteps > 0) {
      newProgress = Math.round((totalScore / totalSteps) * 100);
    }

    if (newProgress === 100) {
      newStatus = 'Completed';
    } else if (newProgress > 0) {
      newStatus = 'In Progress';
    } else {
      newStatus = 'Not Started';
    }

    return { ...goal, progress: newProgress, status: newStatus };
  };

  const addStep = (goalId: string, stepTitle: string) => {
    if (!stepTitle.trim()) return;
    
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        const updatedGoal = {
          ...g,
          steps: [...g.steps, { id: crypto.randomUUID(), title: stepTitle, status: 'Not Started', completed: false }]
        };
        return updateGoalStatus(updatedGoal);
      }
      return g;
    }));
  };

  const changeStepStatus = (goalId: string, stepId: string, status: StepStatus) => {
    setGoals(goals.map(g => {
      if (g.id === goalId) {
        const updatedGoal = {
          ...g,
          steps: g.steps.map(s => s.id === stepId ? { 
              ...s, 
              status, 
              completed: status === 'Completed' // Update legacy field
          } : s)
        };
        return updateGoalStatus(updatedGoal);
      }
      return g;
    }));
  };

  const deleteStep = (goalId: string, stepId: string) => {
    setGoals(goals.map(g => {
        if (g.id === goalId) {
            const updatedGoal = {
                ...g,
                steps: g.steps.filter(s => s.id !== stepId)
            };
            return updateGoalStatus(updatedGoal);
        }
        return g;
    }));
  }

  const editStep = (goalId: string, stepId: string, newTitle: string) => {
    if (!newTitle.trim()) return;

    setGoals(goals.map(g => {
        if (g.id === goalId) {
            const updatedGoal = {
                ...g,
                steps: g.steps.map(s => s.id === stepId ? { ...s, title: newTitle } : s)
            };
            return updatedGoal; // Editing progress title doesn't change status
        }
        return g;
    }));
  };

  const currentYear = new Date().getFullYear();
  const yearlyGoals = goals.filter(g => g.year === currentYear);
  const completedGoals = yearlyGoals.filter(g => g.status === 'Completed').length;

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              {currentYear} Goals
            </h1>
            <p className="text-slate-500 mt-2">
              Set big targets. Break them down. Frog-eat your way to success.
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900">
                <Plus className="mr-2 h-4 w-4" /> New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set a New Goal</DialogTitle>
                <DialogDescription>
                  What do you want to achieve this year?
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={addGoal} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. Run a Marathon" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Why is this important?</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Motivation..." 
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={newCategory} onValueChange={(v) => setNewCategory(v as GoalCategory)}>
                            <SelectTrigger>
                            <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(CATEGORY_COLORS).map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="year">Target Year</Label>
                        <Input 
                            id="year" 
                            type="number" 
                            value={newYear} 
                            onChange={(e) => setNewYear(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Goal</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={!!editingGoal} onOpenChange={(open) => !open && setEditingGoal(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Goal</DialogTitle>
                <DialogDescription>
                  Update your goal details.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={saveEditedGoal} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Goal Title</Label>
                  <Input 
                    id="edit-title" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Why is this important?</Label>
                  <Textarea 
                    id="edit-description" 
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Select value={editCategory} onValueChange={(v) => setEditCategory(v as GoalCategory)}>
                            <SelectTrigger>
                            <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(CATEGORY_COLORS).map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-year">Target Year</Label>
                        <Input 
                            id="edit-year" 
                            type="number" 
                            value={editYear} 
                            onChange={(e) => setEditYear(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{yearlyGoals.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {yearlyGoals.length > 0 
                  ? Math.round(yearlyGoals.reduce((acc, g) => acc + g.progress, 0) / yearlyGoals.length) 
                  : 0}%
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 flex mt-2">
                 {/* Completed Portion - Green */}
                 <div 
                    className="h-full bg-green-500 transition-all duration-500" 
                    style={{ 
                        width: `${yearlyGoals.length > 0 
                            ? (yearlyGoals.reduce((acc, g) => {
                                const total = g.steps.length || 1;
                                const completed = g.steps.filter(s => s.status === 'Completed' || s.completed).length;
                                return acc + (completed / total);
                              }, 0) / yearlyGoals.length) * 100
                            : 0}%` 
                    }}
                 />
                 {/* In Progress Portion - Yellow */}
                 <div 
                    className="h-full bg-yellow-400 transition-all duration-500" 
                    style={{ 
                        width: `${yearlyGoals.length > 0 
                            ? (yearlyGoals.reduce((acc, g) => {
                                const total = g.steps.length || 1;
                                const inProgress = g.steps.filter(s => s.status === 'In Progress').length;
                                return acc + (inProgress / total);
                              }, 0) / yearlyGoals.length) * 50
                            : 0}%` 
                    }}
                 />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {yearlyGoals.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 border-2 border-dashed rounded-lg">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium">No goals set for {currentYear}</h3>
                <p>Start by clicking "New Goal" above.</p>
            </div>
          )}
          
          {yearlyGoals.map(goal => (
            <GoalCard 
                key={goal.id} 
                goal={goal} 
                onEdit={() => openEditModal(goal)}
                onDelete={deleteGoal} 
                onAddStep={addStep} 
                onChangeStepStatus={changeStepStatus}
                onDeleteStep={deleteStep}
                onEditStep={editStep}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GoalCard({ 
    goal, 
    onEdit,
    onDelete, 
    onAddStep, 
    onChangeStepStatus,
    onDeleteStep,
    onEditStep
}: { 
    goal: Goal; 
    onEdit: () => void;
    onDelete: (id: string) => void;
    onAddStep: (goalId: string, title: string) => void;
    onChangeStepStatus: (goalId: string, stepId: string, status: StepStatus) => void;
    onDeleteStep: (goalId: string, stepId: string) => void;
    onEditStep: (goalId: string, stepId: string, newTitle: string) => void;
}) {
  const [newStep, setNewStep] = useState("");
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editingStepTitle, setEditingStepTitle] = useState("");

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStep.trim()) {
      onAddStep(goal.id, newStep);
      setNewStep("");
    }
  };

  const startEditingStep = (step: GoalStep) => {
      setEditingStepId(step.id);
      setEditingStepTitle(step.title);
  };

  const saveStepEdit = (stepId: string) => {
      if (editingStepTitle.trim()) {
          onEditStep(goal.id, stepId, editingStepTitle);
      }
      setEditingStepId(null);
  }

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
            <Badge variant="secondary" className={cn("mb-2", CATEGORY_COLORS[goal.category])}>
                {goal.category}
            </Badge>
            <div className="flex gap-2">
                {goal.status === 'Completed' && <Badge className="bg-green-500 hover:bg-green-600">Achieved</Badge>}
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-blue-500" onClick={onEdit}>
                    <Pencil className="h-4 w-4" />
                </Button>
            </div>
        </div>
        <CardTitle className="leading-tight">{goal.title}</CardTitle>
        <CardDescription className="line-clamp-2">{goal.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
                <span>Progress</span>
                <span>{goal.progress}%</span>
            </div>
            {/* Multi-colored progress bar */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 flex">
               {/* Completed bar - Green */}
               <div 
                  className="h-full bg-green-500 transition-all duration-500" 
                  style={{ width: `${(goal.steps.filter(s => s.status === 'Completed' || s.completed).length / (goal.steps.length || 1)) * 100}%` }}
               />
               {/* In Progress bar - Yellow */}
               <div 
                  className="h-full bg-yellow-400 transition-all duration-500" 
                  style={{ width: `${(goal.steps.filter(s => s.status === 'In Progress').length / (goal.steps.length || 1)) * 50}%` }}
               />
            </div>
        </div>

        <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Key Results / Steps</div>
            {goal.steps.length === 0 && (
                <p className="text-sm text-slate-400 italic">No steps defined yet.</p>
            )}
            <ul className="space-y-2">
                {goal.steps.map(step => (
                    <li key={step.id} className="flex items-start gap-2 group">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className={cn(
                                        "h-5 w-5 mt-0.5 rounded-full border flex items-center justify-center transition-colors p-0 hover:bg-transparent",
                                        (step.status === 'Completed' || step.completed) ? "bg-green-500 border-green-500 text-white" :
                                        step.status === 'In Progress' ? "bg-yellow-100 border-yellow-400 text-yellow-600" :
                                        "border-slate-300 text-transparent hover:border-slate-400"
                                    )}
                                >
                                    {(step.status === 'Completed' || step.completed) && <CheckCircle2 className="h-3 w-3" />}
                                    {step.status === 'In Progress' && <div className="h-2 w-2 rounded-full bg-yellow-500" />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => onChangeStepStatus(goal.id, step.id, 'Not Started')}>
                                    <Circle className="mr-2 h-4 w-4" /> Not Started
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onChangeStepStatus(goal.id, step.id, 'In Progress')}>
                                    <Clock className="mr-2 h-4 w-4 text-yellow-500" /> In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onChangeStepStatus(goal.id, step.id, 'Completed')}>
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Completed
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {editingStepId === step.id ? (
                             <div className="flex-1 flex gap-2">
                                <Input 
                                    value={editingStepTitle} 
                                    onChange={(e) => setEditingStepTitle(e.target.value)}
                                    className="h-7 text-xs"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveStepEdit(step.id);
                                        if (e.key === 'Escape') setEditingStepId(null);
                                    }}
                                />
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => saveStepEdit(step.id)}>
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                </Button>
                             </div>
                        ) : (
                            <>
                                <label 
                                    htmlFor={step.id} 
                                    className={cn(
                                        "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer py-1",
                                        (step.status === 'Completed' || step.completed) ? "line-through text-slate-500" : ""
                                    )}
                                >
                                    {step.title}
                                </label>
                                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => startEditingStep(step)}
                                        className="text-slate-400 hover:text-blue-500 mr-1"
                                    >
                                        <Pencil className="h-3 w-3" />
                                    </button>
                                    <button 
                                        onClick={() => onDeleteStep(goal.id, step.id)}
                                        className="text-slate-400 hover:text-red-500"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-4 border-t bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-3">
        <form onSubmit={handleAddStep} className="flex w-full gap-2">
            <Input 
                value={newStep} 
                onChange={(e) => setNewStep(e.target.value)}
                placeholder="Add a step..." 
                className="h-8 text-xs"
            />
            <Button type="submit" size="sm" variant="outline" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
            </Button>
        </form>
        <div className="flex justify-end w-full">
            <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => onDelete(goal.id)}
            >
                <Trash2 className="h-4 w-4 mr-2" /> Delete Goal
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
