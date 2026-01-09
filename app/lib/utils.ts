import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const timeStringToDecimal = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours + (minutes / 60)).toString();
};

export const calculateEndTime = (startStr: string, durationStr: string) => {
  if (!startStr || !durationStr) return { end: "", nextDay: false };
  const start = parseFloat(startStr);
  const duration = parseFloat(durationStr);
  if (isNaN(start) || isNaN(duration)) return { end: "", nextDay: false };

  let end = start + duration;
  let nextDay = false;
  
  if (end >= 24) {
    end = end - 24;
    nextDay = true;
  }
  
  return { end: end.toString(), nextDay };
};

export const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const getMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
};

// Sort: Priority (A->E), then Order, then CreatedAt
import type { Task } from "~/types";

export const sortTasks = (taskList: Task[]) => {
  return [...taskList].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority.localeCompare(b.priority);
    }
    // If order is defined, use it. Fallback to createdAt for backward compatibility
    const orderA = a.order ?? a.createdAt;
    const orderB = b.order ?? b.createdAt;
    return orderA - orderB;
  });
};


