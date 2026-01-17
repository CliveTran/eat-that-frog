import { useState, useEffect } from "react";
import type { Route } from "./+types/goals";
import type { Goal, GoalCategory, StepStatus } from "~/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { Target, Trophy, Plus } from "lucide-react";
import { GoalCard } from "~/components/goal-card";

export function meta({ }: Route.MetaArgs) {
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
          steps: [...g.steps, { id: crypto.randomUUID(), title: stepTitle, status: 'Not Started' as StepStatus, completed: false }]
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


