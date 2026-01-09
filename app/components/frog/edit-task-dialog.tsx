import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { TIME_OPTIONS } from "~/lib/constants";
import { calculateEndTime } from "~/lib/utils";
import type { Priority, ScheduleBlock, Task } from "~/types";
import { useEffect, useState } from "react";

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Task) => void;
  blocks: ScheduleBlock[];
}

export function EditTaskDialog({ task, open, onOpenChange, onSave, blocks }: EditTaskDialogProps) {
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<Priority>("A");
  const [editIsRecurring, setEditIsRecurring] = useState(false);
  const [editDuration, setEditDuration] = useState("");
  const [editStartHour, setEditStartHour] = useState<string>("");
  const [editEndHour, setEditEndHour] = useState<string>("");
  const [editEndsNextDay, setEditEndsNextDay] = useState(false);
  // We need to track blockId locally as well for the form state
  const [editBlockId, setEditBlockId] = useState<string | undefined>(undefined);


  // Initialize state when task changes or dialog opens
  useEffect(() => {
    if (task && open) {
        setEditTitle(task.title);
        setEditPriority(task.priority);
        setEditIsRecurring(task.isRecurring || false);
        setEditDuration(task.estimatedHours !== undefined ? task.estimatedHours.toString() : "0.5");
        setEditStartHour(task.startHour !== undefined ? task.startHour.toString() : "");
        setEditEndHour(task.endHour !== undefined ? task.endHour.toString() : "");
        setEditEndsNextDay(task.endsNextDay || false);
        setEditBlockId(task.blockId);
    }
  }, [task, open]);

  // Auto-calculate end time when start/duration changes
  useEffect(() => {
    if (open && editStartHour && editDuration) {
      const { end, nextDay } = calculateEndTime(editStartHour, editDuration);
      if (end) {
         setEditEndHour(end);
         setEditEndsNextDay(nextDay);
      }
    }
  }, [editStartHour, editDuration, open]);

  const handleSave = () => {
      if (!task || !editTitle.trim()) return;

      const updatedTask: Task = {
          ...task,
          title: editTitle,
          priority: editPriority,
          isRecurring: editIsRecurring,
          estimatedHours: editDuration ? parseFloat(editDuration) : undefined,
          startHour: editStartHour ? parseFloat(editStartHour) : undefined,
          endHour: editEndHour ? parseFloat(editEndHour) : undefined,
          endsNextDay: editEndsNextDay,
          blockId: editBlockId,
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

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="edit-startHour">Start Time</Label>
                <Select value={editStartHour} onValueChange={setEditStartHour}>
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
              
              <div className="space-y-2 col-span-2">
                 <Label>Schedule Block</Label>
                 <Select 
                      value={editBlockId || "none"} 
                      onValueChange={(val) => setEditBlockId(val === "none" ? undefined : val)}
                  >
                  <SelectTrigger>
                    <SelectValue placeholder="No Block" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Block</SelectItem>
                    {blocks.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.title} ({b.startTime})</SelectItem>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
