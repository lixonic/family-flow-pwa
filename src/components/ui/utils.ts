import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utility for consistent dd/mm/yyyy format
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// For display with weekday (e.g., "Monday, 15/03/2024")
export function formatDateWithWeekday(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const weekday = d.toLocaleDateString('en', { weekday: 'long' });
  return `${weekday}, ${formatDate(d)}`;
}
