import { useState, useEffect } from "react";
import type { Task } from "~/types";

export function useTaskTimer(
  tasks: Task[], 
  updateDailyStats: (isFrog: boolean) => void,
  updateTaskCompletion: (taskId: string, success: boolean, reason?: string) => void
) {
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

  const handleTaskComplete = (success: boolean) => {
    if (!activeTaskId) return;

    updateTaskCompletion(activeTaskId, success, failureReason);
    
    setShowCompletionDialog(false);
    setActiveTaskId(null);
    setFailureReason("");
  };

  return {
      activeTaskId,
      timerSeconds,
      isTimerRunning,
      showCompletionDialog,
      setShowCompletionDialog,
      failureReason,
      setFailureReason,
      startTask,
      stopTask,
      handleTaskComplete
  };
}
