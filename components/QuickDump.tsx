"use client";

import { useState, useRef } from "react";
import { DayData, DayKey } from "@/lib/types";
import { getTodayKey } from "@/lib/week";

interface QuickDumpProps {
  days: DayData[];
  onDump: (titles: string[], dayKey: DayKey) => void;
}

export function QuickDump({ days, onDump }: QuickDumpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [selectedDay, setSelectedDay] = useState<DayKey>(getTodayKey());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDump = () => {
    const titles = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (titles.length > 0) {
      onDump(titles, selectedDay);
      setText("");
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
    if (e.key === "Enter" && e.metaKey) {
      handleDump();
    }
  };

  if (!isOpen) {
    return (
      <button className="quick-dump-toggle" onClick={() => setIsOpen(true)}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 3v12" />
          <path d="M5 10l7 7 7-7" />
          <path d="M5 21h14" />
        </svg>
        Quick Dump
      </button>
    );
  }

  return (
    <div className="quick-dump-panel" onKeyDown={handleKeyDown}>
      <div className="quick-dump-header">
        <h3>Quick Dump</h3>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <p className="quick-dump-hint">Paste multiple tasks, one per line</p>

      <textarea
        ref={textareaRef}
        className="quick-dump-input"
        placeholder="Buy milk&#10;Call mom&#10;Finish report..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        autoFocus
      />

      <div className="quick-dump-day-select">
        <label>Add to:</label>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          {days.map((day) => (
            <option key={day.dayKey} value={day.dayKey}>
              {day.dayName} {day.dayNumber}/{day.monthName}{" "}
              {day.isToday ? "(Today)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="quick-dump-actions">
        <button className="cancel-btn" onClick={() => setIsOpen(false)}>
          Cancel
        </button>
        <button
          className="submit-btn"
          onClick={handleDump}
          disabled={!text.trim()}
        >
          Add Tasks (⌘↵)
        </button>
      </div>
    </div>
  );
}
