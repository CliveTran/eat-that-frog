export type Priority = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  isRecurring?: boolean;
  estimatedHours?: number;
  startHour?: number; // 0-23
  endHour?: number;   // 0-23
  endsNextDay?: boolean;
  failureReason?: string;
  order: number;
  createdAt: number;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  frogEaten: boolean;
  tasksCompleted: number;
}
