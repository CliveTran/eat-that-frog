import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { Goal, GoalCategory, GoalStep, StepStatus } from "~/types";
import { CheckCircle2, Circle, Clock, Pencil, Plus, Trash2 } from "lucide-react";

const CATEGORY_COLORS: Record<GoalCategory, string> = {
    Career: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Health: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    Finance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    Personal: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    Education: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    Other: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
};

interface GoalCardProps {
    goal: Goal;
    onEdit: () => void;
    onDelete: (id: string) => void;
    onAddStep: (goalId: string, title: string) => void;
    onChangeStepStatus: (goalId: string, stepId: string, status: StepStatus) => void;
    onDeleteStep: (goalId: string, stepId: string) => void;
    onEditStep: (goalId: string, stepId: string, newTitle: string) => void;
}

export function GoalCard({
    goal,
    onEdit,
    onDelete,
    onAddStep,
    onChangeStepStatus,
    onDeleteStep,
    onEditStep
}: GoalCardProps) {
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
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted flex">
                        {/* Completed bar - Green */}
                        <div
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{ width: `${(goal.steps.filter(s => s.status === 'Completed' || s.completed).length / (goal.steps.length || 1)) * 100}%` }}
                        />
                        {/* In Progress bar - Yellow */}
                        <div
                            className="h-full bg-yellow-400 transition-all duration-500"
                            style={{ width: `${(goal.steps.filter(s => s.status === 'In Progress').length / (goal.steps.length || 1)) * 100}%` }}
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

            <CardFooter className="pt-2 pb-4 border-t bg-muted/50 flex flex-col gap-3">
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
