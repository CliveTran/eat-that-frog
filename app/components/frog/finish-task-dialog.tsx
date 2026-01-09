import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";

interface FinishTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  failureReason: string;
  setFailureReason: (reason: string) => void;
  handleTaskComplete: (success: boolean) => void;
}

export function FinishTaskDialog({
  open,
  onOpenChange,
  failureReason,
  setFailureReason,
  handleTaskComplete
}: FinishTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
}
