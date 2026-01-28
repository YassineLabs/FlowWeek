// Core data types for FlowWeek

export type WeekKey = string; // Format: "2026-W05"
export type DayKey = string; // Format: "YYYY-MM-DD"

export type TaskTag = "work" | "personal";
export type TaskStatus = "todo" | "done" | "blocked";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  tag?: TaskTag;
  status: TaskStatus;
  day: DayKey;
  createdAt: number;
  updatedAt: number;
}

export interface DayData {
  date: Date;
  dayKey: DayKey;
  dayName: string;
  dayNumber: number;
  monthName: string;
  isToday: boolean;
}

export interface WeekData {
  weekKey: WeekKey;
  days: DayData[];
  startDate: Date;
  endDate: Date;
}
