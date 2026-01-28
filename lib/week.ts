// ISO Week calculations (Monday start)

import { DayData, DayKey, WeekData, WeekKey } from "./types";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Get ISO week number and year for a given date
 * ISO weeks start on Monday
 */
export function getISOWeekData(date: Date): { year: number; week: number } {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7; // Make Sunday = 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum); // Set to nearest Thursday
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return { year: d.getUTCFullYear(), week: weekNum };
}

/**
 * Generate WeekKey from date (e.g., "2026-W05")
 */
export function getWeekKey(date: Date): WeekKey {
  const { year, week } = getISOWeekData(date);
  return `${year}-W${week.toString().padStart(2, "0")}`;
}

/**
 * Generate DayKey from date (e.g., "2026-01-27")
 */
export function getDayKey(date: Date): DayKey {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse DayKey back to Date
 */
export function parseDayKey(dayKey: DayKey): Date {
  const [year, month, day] = dayKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get Monday of the ISO week containing the given date
 */
export function getWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  return new Date(d.setDate(diff));
}

/**
 * Get the first day (Monday) of a week from WeekKey
 */
export function parseWeekKey(weekKey: WeekKey): Date {
  const match = weekKey.match(/^(\d{4})-W(\d{2})$/);
  if (!match) throw new Error(`Invalid week key: ${weekKey}`);

  const year = parseInt(match[1]);
  const week = parseInt(match[2]);

  // January 4th is always in week 1
  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7;

  // Get Monday of week 1
  const week1Monday = new Date(jan4);
  week1Monday.setDate(jan4.getDate() - jan4Day + 1);

  // Add weeks
  const targetMonday = new Date(week1Monday);
  targetMonday.setDate(week1Monday.getDate() + (week - 1) * 7);

  return targetMonday;
}

/**
 * Get all 7 days of a week
 */
export function getWeekDays(weekKey: WeekKey): DayData[] {
  const monday = parseWeekKey(weekKey);
  const today = new Date();
  const todayKey = getDayKey(today);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dayKey = getDayKey(date);

    return {
      date,
      dayKey,
      dayName: DAY_NAMES[i],
      dayNumber: date.getDate(),
      monthName: MONTH_NAMES[date.getMonth()],
      isToday: dayKey === todayKey,
    };
  });
}

/**
 * Get week data for a given week key
 */
export function getWeekData(weekKey: WeekKey): WeekData {
  const days = getWeekDays(weekKey);
  return {
    weekKey,
    days,
    startDate: days[0].date,
    endDate: days[6].date,
  };
}

/**
 * Get current week key
 */
export function getCurrentWeekKey(): WeekKey {
  return getWeekKey(new Date());
}

/**
 * Get today's day key
 */
export function getTodayKey(): DayKey {
  return getDayKey(new Date());
}

/**
 * Navigate to adjacent weeks
 */
export function getAdjacentWeekKey(weekKey: WeekKey, offset: number): WeekKey {
  const monday = parseWeekKey(weekKey);
  monday.setDate(monday.getDate() + offset * 7);
  return getWeekKey(monday);
}

/**
 * Get next day key (handles week boundaries)
 */
export function getNextDayKey(dayKey: DayKey): DayKey {
  const date = parseDayKey(dayKey);
  date.setDate(date.getDate() + 1);
  return getDayKey(date);
}

/**
 * Check if a day is in a different week than the reference
 */
export function isInDifferentWeek(
  dayKey: DayKey,
  referenceWeekKey: WeekKey,
): boolean {
  const dayWeekKey = getWeekKey(parseDayKey(dayKey));
  return dayWeekKey !== referenceWeekKey;
}

/**
 * Format week range for display
 */
export function formatWeekRange(weekKey: WeekKey): string {
  const { days } = getWeekData(weekKey);
  const start = days[0];
  const end = days[6];

  if (start.date.getMonth() === end.date.getMonth()) {
    return `${start.dayNumber} - ${end.dayNumber} ${end.monthName}`;
  }
  return `${start.dayNumber} ${start.monthName} - ${end.dayNumber} ${end.monthName}`;
}
