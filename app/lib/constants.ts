import type { Priority } from "~/types";

export const PRIORITY_LABELS: Record<Priority, string> = {
  A: "Must do (Serious consequences)",
  B: "Should do (Minor consequences)",
  C: "Nice to do (No consequences)",
  D: "Delegate",
  E: "Eliminate",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  A: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  B: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  C: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  D: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  E: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
};

export const BLOCK_COLORS = [
  { label: "Blue", value: "bg-blue-100 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800" },
  { label: "Green", value: "bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-800" },
  { label: "Yellow", value: "bg-yellow-100 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-800" },
  { label: "Red", value: "bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-800" },
  { label: "Purple", value: "bg-purple-100 dark:bg-purple-900/50 border-purple-200 dark:border-purple-800" },
  { label: "Gray", value: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" },
];

export const BLOCK_TIMES = Array.from({ length: 24 }).flatMap((_, i) => [
    `${i.toString().padStart(2, '0')}:00`,
    `${i.toString().padStart(2, '0')}:30`
]);

export const TIME_OPTIONS = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return {
    value: (i / 2).toString(),
    label: `${hour.toString().padStart(2, '0')}:${minute}`
  };
});
// Add 24:00 as an end option
TIME_OPTIONS.push({ value: "24", label: "24:00" });
