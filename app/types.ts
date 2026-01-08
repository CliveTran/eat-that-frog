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

export type GoalCategory = 'Career' | 'Health' | 'Finance' | 'Personal' | 'Education' | 'Other';

export type StepStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface GoalStep {
  id: string;
  title: string;
  status: StepStatus;
  completed?: boolean; // Deprecated, kept for backward compatibility if needed, but better to migrate
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  year: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number; // 0-100
  steps: GoalStep[];
  createdAt: number;
}
