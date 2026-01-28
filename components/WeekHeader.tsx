"use client";

import { WeekKey } from "@/lib/types";
import {
  formatWeekRange,
  getCurrentWeekKey,
  getAdjacentWeekKey,
} from "@/lib/week";

interface WeekHeaderProps {
  weekKey: WeekKey;
  onWeekChange: (weekKey: WeekKey) => void;
}

export function WeekHeader({ weekKey, onWeekChange }: WeekHeaderProps) {
  const currentWeekKey = getCurrentWeekKey();
  const isCurrentWeek = weekKey === currentWeekKey;
  const weekRange = formatWeekRange(weekKey);

  return (
    <header className="week-header">
      <div className="week-nav">
        <button
          className="nav-btn"
          onClick={() => onWeekChange(getAdjacentWeekKey(weekKey, -1))}
          aria-label="Previous week"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="week-info">
          <h1 className="week-title">
            {isCurrentWeek ? "This Week" : weekKey}
          </h1>
          <span className="week-range">{weekRange}</span>
        </div>

        <button
          className="nav-btn"
          onClick={() => onWeekChange(getAdjacentWeekKey(weekKey, 1))}
          aria-label="Next week"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {!isCurrentWeek && (
        <button
          className="today-btn"
          onClick={() => onWeekChange(currentWeekKey)}
        >
          Today
        </button>
      )}
    </header>
  );
}
