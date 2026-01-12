import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Priority, Task } from "~/types";
import { useEffect, useState } from "react";

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Task) => void;
}

export function EditTaskDialog({ task, open, onOpenChange, onSave }: EditTaskDialogProps) {
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<Priority>("A");
  const [editIsRecurring, setEditIsRecurring] = useState(false);
  const [editDuration, setEditDuration] = useState("");

  // Initialize state when task changes or dialog opens
  useEffect(() => {
    if (task && open) {
        setEditTitle(task.title);
        setEditPriority(task.priority);
        setEditIsRecurring(task.isRecurring || false);
        setEditDuration(task.estimatedHours !== undefined ? task.estimatedHours.toString() : "0.5");
    }
  }, [task, open]);

  const handleSave = () => {
      if (!task || !editTitle.trim()) return;

      const updatedTask: Task = {
          ...task,
          title: editTitle,
          priority: editPriority,
          isRecurring: editIsRecurring,
          estimatedHours: editDuration ? parseFloat(editDuration) : undefined,
      };
      
      onSave(updatedTask);
      onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                onChange={(e) => setEditDuration(e.target.value)}
              />
            </div>

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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
